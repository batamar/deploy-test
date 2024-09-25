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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sessions = void 0;
const _ = __importStar(require("lodash"));
const dotenv = __importStar(require("dotenv"));
const mongoose = __importStar(require("mongoose"));
const crypto = __importStar(require("crypto"));
const bcrypt = __importStar(require("bcryptjs"));
const sha256_1 = __importDefault(require("sha256"));
const aws_ses_1 = __importDefault(require("../aws-ses"));
dotenv.config();
const { URL_APP } = process.env;
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
const sendAuthEmail = async (email, token) => {
    console.log(`${URL_APP}/verify-registration?token=${token}`);
    try {
        await (0, aws_ses_1.default)({
            from: `Kelly from workinbiotech.com <${process.env.FROM_EMAIL_ADDRESS}>`,
            to: [email],
            subject: 'Work in biotech registration',
            body: _.template(`
        <p>
          To register your account at Work in biotech, click the following verification link: <a href="${URL_APP}/verify-registration?token=<%= token %>">Click here to verify</a>
        </p>
        `)({ token }),
        });
    }
    catch (err) {
        console.log('Email sending error:', err);
    }
};
const mongoSchema = new mongoose.Schema({
    organizationId: { type: String },
    googleId: { type: String },
    avatarUrl: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    title: { type: String },
    phone: { type: String },
    email: { type: String, required: true, unique: true },
    username: { type: String },
    role: { type: String },
    password: { type: String },
    registrationToken: { type: String },
    registrationTokenExpires: { type: Date },
    isVerified: { type: Boolean },
    createdAt: { type: Date, required: true },
    lastUpdatedAt: { type: Date },
    lastLoginAt: { type: Date },
    status: { type: String },
    timezone: { type: String },
    meetingIntegrationUserName: { type: String },
    proratedAmount: { type: Number },
    stripeCustomerId: {
        type: String
    },
    stripePaymentMethodId: {
        type: String,
    },
    stripeSubscriptionId: {
        type: String
    },
});
class UserClass extends mongoose.Model {
    static async generateToken() {
        const buffer = await crypto.randomBytes(20);
        const token = buffer.toString('hex');
        return {
            token,
            expires: Date.now() + 86400000
        };
    }
    static generatePassword(password) {
        const hashPassword = (0, sha256_1.default)(password);
        return bcrypt.hash(hashPassword, 12);
    }
    static checkPassword(password) {
        if (!password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)) {
            throw new Error('Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters');
        }
    }
    static comparePassword(password, userPassword) {
        const hashPassword = (0, sha256_1.default)(password);
        return bcrypt.compare(hashPassword, userPassword);
    }
    static async register({ email, password, passwordConfirmation }) {
        if (!isValidEmail(email)) {
            throw new Error('Invalid email');
        }
        const prev = await this.find({ email }).countDocuments();
        if (prev > 0) {
            throw new Error('Already exists');
        }
        if (password === '') {
            throw new Error('Password can not be empty');
        }
        if (password !== passwordConfirmation) {
            throw new Error('Password does not match');
        }
        this.checkPassword(password);
        const { token, expires } = await User.generateToken();
        await sendAuthEmail(email, token);
        return this.create({
            createdAt: new Date(),
            password: await this.generatePassword(password),
            email,
            isVerified: false,
            registrationToken: token,
            registrationTokenExpires: expires,
        });
    }
    static async createUser(args) {
        const { email, organizationId, password, passwordConfirmation } = args, rest = __rest(args, ["email", "organizationId", "password", "passwordConfirmation"]);
        if (!isValidEmail(email)) {
            throw new Error('Invalid email');
        }
        const prev = await this.find({ email }).countDocuments();
        if (prev > 0) {
            throw new Error('Already exists');
        }
        if (password === '') {
            throw new Error('Password can not be empty');
        }
        if (password !== passwordConfirmation) {
            throw new Error('Password does not match');
        }
        this.checkPassword(password);
        return this.create(Object.assign({ createdAt: new Date(), password: await this.generatePassword(password), organizationId,
            email, isVerified: true }, rest));
    }
    static async confirmToken(token, type = 'registration') {
        const user = await this.findOne({
            [type === 'registration' ? 'registrationToken' : 'resetPasswordToken']: token,
            [type === 'registration' ? 'registrationTokenExpires' : 'resetPasswordExpires']: {
                $gt: Date.now()
            }
        });
        if (!user || !token) {
            throw new Error('Token is invalid or has expired');
        }
        await this.updateOne({ _id: user._id }, {
            $set: {
                isVerified: true,
                registrationToken: null,
                registrationTokenExpires: null
            }
        });
    }
    static publicFields() {
        return ['_id', 'id', 'email', 'role', 'status', 'lastLoginAt', 'avatarUrl'];
    }
}
mongoSchema.loadClass(UserClass);
const User = mongoose.model('User', mongoSchema);
exports.default = User;
exports.Sessions = mongoose.model('sessions', new mongoose.Schema({}, { strict: false }));
