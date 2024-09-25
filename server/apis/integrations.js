"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const utils_1 = require("../utils");
const User_1 = __importDefault(require("../models/User"));
const Events_1 = __importDefault(require("../models/Events"));
const Integrations_1 = __importDefault(require("../models/Integrations"));
const google_1 = require("./google");
function default_1({ server }) {
    server.get('/users/get-integrations-by-user', (0, utils_1.routeErrorHandling)(async (req, res, next) => {
        await (0, utils_1.requireLogin)(req, res, next);
        const integrations = await Integrations_1.default.find({ userId: req.user._id }).lean();
        return res.json(integrations);
    }));
    server.post('/integrations/configure', (0, utils_1.routeErrorHandling)(async (req, res, next) => {
        await (0, utils_1.requireLogin)(req, res, next);
        const { _id, type, data } = req.body;
        if (type === 'meeting-scheduler') {
            const calendarIntegration = await Integrations_1.default.findOne({ userId: req.user._id, type: 'calendar' });
            if (!calendarIntegration) {
                throw new Error('Please configure calendar integration first');
            }
            const existingSelector = { type, 'data.username': data.username };
            if (_id) {
                existingSelector._id = { $ne: _id };
            }
            const existingIntegration = await Integrations_1.default.findOne(existingSelector);
            if (existingIntegration) {
                throw new Error('Integration with this username already exists');
            }
        }
        const prev = await Integrations_1.default.findOne({ _id });
        if (prev) {
            await Integrations_1.default.updateOne({ _id }, { $set: { data } });
        }
        else {
            await Integrations_1.default.create({
                userId: req.user._id,
                isActive: true,
                type,
                data
            });
        }
        await User_1.default.updateOne({ _id: req.user._id }, { $set: { meetingIntegrationUserName: data.username } });
        return res.json({ message: 'ok' });
    }));
    server.post('/integrations/delete', (0, utils_1.routeErrorHandling)(async (req, res, next) => {
        await (0, utils_1.requireAdmin)(req, res, next);
        const { type } = req.body;
        await Integrations_1.default.deleteOne({ userId: req.user._id, type });
        return res.json({ message: 'ok' });
    }));
    const format = 'YYYY-MM-DD HH:mm';
    const toDate = (date) => {
        return new Date(date.format(format));
    };
    const generateAvailableTimeslots = async (userId, date, timezone, userTimeZone, days, durationMinutes) => {
        const events = await Events_1.default.find({ userId });
        const dateObj = new Date(date);
        const day = dateObj.getDay();
        let dayConfig = days[day];
        if (!dayConfig && day === 0) {
            dayConfig = days[5];
        }
        if (!dayConfig && day === 6) {
            dayConfig = days[5];
        }
        if (!dayConfig) {
            return [];
        }
        const startTime = dayConfig.from;
        const endTime = dayConfig.to;
        const forCustomerStartTime = moment_timezone_1.default.tz(`${date} ${startTime}`, userTimeZone).tz(timezone).format('HH:mm');
        const forCustomerEndTime = moment_timezone_1.default.tz(`${date} ${endTime}`, userTimeZone).tz(timezone).format('HH:mm');
        const tuStartDateTime = moment_timezone_1.default.tz(`${date} ${forCustomerStartTime}`, timezone).tz(userTimeZone);
        const tuEndDateTime = moment_timezone_1.default.tz(`${date} ${forCustomerEndTime}`, timezone).tz(userTimeZone);
        const tuStartDay = toDate(tuStartDateTime).getDay();
        if (!days[tuStartDay]) {
            return [];
        }
        const availableTimeslots = [];
        let slot = tuStartDateTime.clone();
        while (slot.isBefore(tuEndDateTime)) {
            const isAlreadyBooked = events.some(event => {
                const eventStartDateTime = moment_timezone_1.default.tz(event.startDateTime, userTimeZone);
                const eventEndDateTime = moment_timezone_1.default.tz(event.endDateTime, userTimeZone);
                const slotStartTime = slot.clone().tz(userTimeZone);
                const slotEndTime = slot.clone().add(durationMinutes, 'minutes').tz(userTimeZone);
                return eventStartDateTime.isSameOrBefore(slotStartTime) && eventEndDateTime.isSameOrAfter(slotEndTime);
            });
            if (!isAlreadyBooked) {
                availableTimeslots.push(slot.clone().tz(timezone).format('HH:mm'));
            }
            slot.add(durationMinutes, 'minutes');
        }
        return availableTimeslots;
    };
    server.post('/integrations/meeting-scheduler/get-available-times', (0, utils_1.routeErrorHandling)(async (req, res) => {
        const { username, date, requestedMinutes, timeZone } = req.body;
        const user = await User_1.default.findOne({ meetingIntegrationUserName: username });
        if (!user) {
            throw new Error('User not found');
        }
        const userTimeZone = user.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (!date || !timeZone) {
            return res.json({ times: [], defaultTimeZone: userTimeZone });
        }
        const integration = await Integrations_1.default.findOne({ userId: user._id, type: 'meeting-scheduler' });
        if (!integration || !integration.data) {
            throw new Error('Integration not found');
        }
        const days = integration.data.days || {};
        return res.json({
            defaultTimeZone: userTimeZone,
            times: await generateAvailableTimeslots(user._id, date, timeZone, userTimeZone, days, parseInt(requestedMinutes))
        });
    }));
    server.post('/integrations/meeting-scheduler/create-event', (0, utils_1.routeErrorHandling)(async (req, res) => {
        const { username, date, slot, duration, timezone, firstName, lastName, email } = req.body;
        const user = await User_1.default.findOne({ meetingIntegrationUserName: username });
        if (!user) {
            throw new Error('User not found');
        }
        const integration = await Integrations_1.default.findOne({ userId: user._id, type: 'calendar' });
        if (!integration || !integration.credentials) {
            throw new Error('Integration not found');
        }
        const startDateTime = moment_timezone_1.default.tz(`${date} ${slot}`, format, timezone);
        const endDateTime = startDateTime.clone().add(duration, 'minutes');
        const eventParams = {
            title: `${user.email} <> ${firstName} ${lastName}`,
            start: {
                dateTime: startDateTime.toISOString(),
                timeZone: timezone
            },
            end: {
                dateTime: endDateTime.toISOString(),
                timeZone: timezone
            },
            participants: [
                { email: user.email },
                { name: `${firstName} ${lastName}`, email }
            ]
        };
        await (0, google_1.createAnEvent)(Object.assign({ userId: user._id }, eventParams));
        await Events_1.default.create(Object.assign(Object.assign({ userId: user._id }, eventParams), { startDateTime,
            endDateTime }));
        return res.json({ message: 'ok' });
    }));
    server.get('/integrations/calendar/list-events', async (req, res) => {
        try {
            const integration = await Integrations_1.default.findOne({ userId: req.user._id, type: 'calendar' });
            if (!integration || !integration.credentials || !integration.credentials.access_token) {
                return res.json([]);
            }
            const events = await (0, google_1.listEvents)(req.user._id);
            for (const event of events) {
                let start;
                let end;
                let isAllDay = false;
                if (event.start.date) {
                    start = (0, moment_timezone_1.default)(event.start.date).toDate();
                    end = (0, moment_timezone_1.default)(start).endOf('day').toDate();
                    isAllDay = true;
                }
                else {
                    start = (0, moment_timezone_1.default)(event.start.dateTime).tz(event.start.timeZone).toDate();
                    end = (0, moment_timezone_1.default)(event.end.dateTime).tz(event.end.timeZone).toDate();
                }
                const prevEvent = await Events_1.default.findOne({
                    googleEventId: event.id
                });
                const doc = {
                    title: event.summary,
                    participants: event.attendees,
                    startDateTime: start,
                    endDateTime: end,
                    isAllDay
                };
                if (prevEvent) {
                    await Events_1.default.updateOne({ googleEventId: event.id }, {
                        $set: doc
                    });
                }
                else {
                    await Events_1.default.create(Object.assign({ googleEventId: event.id, userId: req.user._id }, doc));
                }
            }
        }
        catch (error) {
            console.error("Error fetching events:", error);
        }
        const events = await Events_1.default.find({ userId: req.user._id });
        return res.json(events);
    });
}
exports.default = default_1;
