"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importStar(require("../models/User"));
const Organizations_1 = __importDefault(require("../models/Organizations"));
const utils_1 = require("../utils");
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { URL_APP, JWT_TOKEN_SECRET } = process.env;
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ id: userId }, JWT_TOKEN_SECRET, { expiresIn: '30h' });
};
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
}, async (_accessToken, _refreshToken, profile, done) => {
    var _a, _b, _c;
    let user = await User_1.default.findOne({ googleId: profile.id });
    const email = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value;
    if (!user) {
        user = await User_1.default.findOne({ email });
    }
    if (!user) {
        const [firstName, lastName] = profile.displayName.split(' ');
        user = new User_1.default({
            createdAt: new Date(),
            googleId: profile.id,
            firstName,
            lastName,
            avatarUrl: (_b = profile.photos) === null || _b === void 0 ? void 0 : _b[0].value,
            email: (_c = profile.emails) === null || _c === void 0 ? void 0 : _c[0].value,
        });
        await user.save();
    }
    await User_1.Sessions.deleteMany({ 'session.passport.user': user._id.toString() });
    done(null, user);
}));
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
}, async (req, email, password, done) => {
    try {
        const user = await User_1.default.findOne({ email, isVerified: true });
        if (!user) {
            return done(null, false, { message: 'Incorrect email or password.' });
        }
        if (!user.password) {
            return done(null, false, { message: 'Please confirm your email first.' });
        }
        if (user.password && await User_1.default.comparePassword(password, user.password)) {
            if (req.headers['source'] !== 'Extension') {
                await User_1.Sessions.deleteMany({ 'session.passport.user': user._id.toString() });
            }
            return done(null, user);
        }
        else {
            return done(null, false, { message: 'Incorrect email or password.' });
        }
    }
    catch (err) {
        return done(err);
    }
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => {
    User_1.default.findById(id, (err, user) => {
        done(err, user);
    });
});
function default_1({ server }) {
    server.get('/verify-registration', (0, utils_1.routeErrorHandling)(async (req, res) => {
        const { token } = req.query;
        await User_1.default.confirmToken(token, 'registration');
        return res.redirect(URL_APP);
    }));
    server.post('/auth/register', (0, utils_1.routeErrorHandling)(async (req, res) => {
        const { email, password, passwordConfirmation, } = req.body;
        let data;
        data = await User_1.default.register({
            email,
            password,
            passwordConfirmation
        });
        const organization = await Organizations_1.default.create({
            createdAt: new Date(),
            ownerEmail: email,
        });
        await User_1.default.updateOne({ email }, { $set: { organizationId: organization._id, role: 'superAdmin' } });
        return res.json({ data });
    }));
    server.post('/auth/login', (req, res, next) => {
        passport_1.default.authenticate('local', (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).json({ message: info.message });
            }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                if (req.headers['source'] === 'Extension') {
                    const token = generateToken(req.user._id.toString());
                    return res.status(200).json({ token });
                }
                return res.status(200).json({ message: 'Logged in successfully' });
            });
        })(req, res, next);
    });
    server.get('/auth/logout', (req, res) => {
        req.logout((err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to log out' });
            }
            req.session.destroy((err) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to destroy session' });
                }
                res.clearCookie('connect.sid');
                const { subdomain } = req.query;
                res.redirect(subdomain ? URL_APP.replace('app.', `${subdomain}.`) : '/');
            });
        });
    });
    server.get('/auth/google', (req, res, next) => {
        const redirectUrl = req.query.redirect_url || '/';
        passport_1.default.authenticate('google', {
            scope: ['profile', 'email'],
            state: JSON.stringify({ redirectUrl })
        })(req, res, next);
    });
    server.get('/auth/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/' }), (req, res) => {
        const state = JSON.parse(req.query.state || '{}');
        const redirectUrl = state.redirectUrl || '/';
        if (redirectUrl === '/') {
            return res.redirect('/');
        }
        const token = generateToken(req.user.id);
        return res.redirect(`${redirectUrl}?tt-token=${token}`);
    });
}
exports.default = default_1;
