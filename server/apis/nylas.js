"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAnEvent = exports.nylas = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const nylas_1 = __importDefault(require("nylas"));
const Integrations_1 = __importDefault(require("../models/Integrations"));
dotenv_1.default.config();
const config = {
    clientId: process.env.NYLAS_CLIENT_ID,
    callbackUri: "http://localhost:3000/nylas/oauth/exchange",
    apiKey: process.env.NYLAS_API_KEY,
    apiUri: process.env.NYLAS_API_URI,
};
exports.nylas = new nylas_1.default({
    apiKey: config.apiKey,
    apiUri: config.apiUri
});
function default_1({ server }) {
    server.get("/nylas/auth", (_req, res) => {
        const authUrl = exports.nylas.auth.urlForOAuth2({
            clientId: config.clientId,
            redirectUri: config.callbackUri,
        });
        res.redirect(authUrl);
    });
    server.get("/nylas/oauth/exchange", async (req, res) => {
        console.log("Received callback from Nylas");
        const code = req.query.code;
        if (!code) {
            res.status(400).send("No authorization code returned from Nylas");
            return;
        }
        const codeExchangePayload = {
            clientSecret: config.apiKey,
            clientId: config.clientId,
            redirectUri: config.callbackUri,
            code,
        };
        try {
            const response = await exports.nylas.auth.exchangeCodeForToken(codeExchangePayload);
            const selector = { userId: req.user._id, type: 'calendar' };
            const previousIntegration = await Integrations_1.default.findOne(selector);
            if (previousIntegration) {
                await Integrations_1.default.updateOne(selector, {
                    $set: {
                        credentials: response
                    }
                });
            }
            else {
                await Integrations_1.default.create(Object.assign(Object.assign({}, selector), { credentials: response, isActive: true }));
            }
            res.redirect('/settings');
        }
        catch (error) {
            res.status(500).send(`Failed to exchange authorization code for token: ${error}`);
        }
    });
}
exports.default = default_1;
const createAnEvent = async ({ grantId, title, startTime, endTime, participants }) => {
    await exports.nylas.events.create({
        identifier: grantId,
        requestBody: {
            title,
            when: {
                startTime,
                endTime,
            },
            participants,
        },
        queryParams: {
            calendarId: process.env.CALENDAR_ID || 'primary',
        },
    });
};
exports.createAnEvent = createAnEvent;
