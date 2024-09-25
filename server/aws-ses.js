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
const nodemailer_1 = __importDefault(require("nodemailer"));
const aws = __importStar(require("aws-sdk"));
const path_1 = __importDefault(require("path"));
const aws_s3_1 = require("./aws-s3");
aws.config.update({
    accessKeyId: process.env.AWS_ACCESSKEYID,
    secretAccessKey: process.env.AWS_SECRETACCESSKEY,
    region: process.env.AWS_REGION,
});
const transporter = nodemailer_1.default.createTransport({
    SES: new aws.SES({
        apiVersion: 'latest',
    })
});
const sendEmail = async (options) => {
    try {
        let attachments = [];
        if (options.attachments) {
            for (const attachment of options.attachments) {
                attachments.push({
                    filename: path_1.default.basename(attachment),
                    content: await (0, aws_s3_1.getObject)(attachment)
                });
            }
        }
        const mailOptions = {
            from: options.from,
            to: options.to,
            cc: options.cc,
            replyTo: options.replyTo,
            subject: options.subject,
            html: options.body,
            attachments: attachments,
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info);
    }
    catch (error) {
        console.error('Error sending email:', error);
    }
};
exports.default = sendEmail;
