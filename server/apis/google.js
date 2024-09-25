"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listEvents = exports.createAnEvent = void 0;
const googleapis_1 = require("googleapis");
const Integrations_1 = __importDefault(require("../models/Integrations"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = process.env;
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
    throw new Error('Google client ID, client secret, and redirect URI must be provided');
}
const oauth2Client = new googleapis_1.google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);
function authorizeUrl() {
    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/userinfo.email'],
    });
}
function getAccessToken(code, callback) {
    oauth2Client.getToken(code, (err, token) => {
        if (err)
            return console.error('Error retrieving access token', err);
        oauth2Client.setCredentials(token);
        process.env.GOOGLE_REFRESH_TOKEN = (token === null || token === void 0 ? void 0 : token.refresh_token) || '';
        callback(oauth2Client);
    });
}
async function getUserEmail(auth) {
    const oauth2 = googleapis_1.google.oauth2({ version: 'v2', auth });
    const userinfo = await oauth2.userinfo.get();
    return userinfo.data.email;
}
function default_1({ server }) {
    server.get('/google/auth', (_req, res) => {
        const authUrl = authorizeUrl();
        res.redirect(authUrl);
    });
    server.get('/google/oauth2callback', async (req, res) => {
        const code = req.query.code;
        getAccessToken(code, async (auth) => {
            const selector = { userId: req.user._id, type: 'calendar' };
            const previousIntegration = await Integrations_1.default.findOne(selector);
            const email = await getUserEmail(auth);
            const credentials = Object.assign(Object.assign({}, auth.credentials), { email });
            if (previousIntegration) {
                await Integrations_1.default.updateOne(selector, { $set: { credentials } });
            }
            else {
                await Integrations_1.default.create(Object.assign(Object.assign({}, selector), { credentials, isActive: true }));
            }
            res.redirect('/settings');
        });
    });
}
exports.default = default_1;
const createAnEvent = async ({ userId, title, start, end, participants }) => {
    const integration = await Integrations_1.default.findOne({ userId, type: 'calendar' });
    oauth2Client.setCredentials({
        access_token: integration.credentials.access_token,
        refresh_token: integration.credentials.refresh_token,
    });
    const calendar = googleapis_1.google.calendar({ version: 'v3', auth: oauth2Client });
    const event = {
        summary: title,
        start: start,
        end: end,
        attendees: participants,
    };
    return new Promise((resolve, reject) => {
        calendar.events.insert({
            calendarId: 'primary',
            requestBody: event,
        }, (err, event) => {
            if (err) {
                return reject(err);
            }
            console.log(`Event created: ${event === null || event === void 0 ? void 0 : event.data.htmlLink}`);
            resolve(event === null || event === void 0 ? void 0 : event.data.htmlLink);
        });
    });
};
exports.createAnEvent = createAnEvent;
const listEvents = async (userId) => {
    const integration = await Integrations_1.default.findOne({ userId, type: 'calendar' });
    oauth2Client.setCredentials({
        access_token: integration.credentials.access_token,
        refresh_token: integration.credentials.refresh_token,
    });
    const calendar = googleapis_1.google.calendar({ version: 'v3', auth: oauth2Client });
    const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        orderBy: 'startTime',
    });
    return response.data.items;
};
exports.listEvents = listEvents;
