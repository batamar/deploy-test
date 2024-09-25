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
Object.defineProperty(exports, "__esModule", { value: true });
exports.signRequestForUpload = exports.getObject = exports.readFile = exports.uploadFile = exports.uploadBufer = void 0;
const fs = __importStar(require("fs"));
const pathModule = __importStar(require("path"));
const aws = __importStar(require("aws-sdk"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const { AWS_BUCKET, AWS_BUCKET_PREFIX, AWS_REGION, AWS_SECRETACCESSKEY, AWS_ACCESSKEYID, } = process.env;
const createAWS = () => {
    aws.config.update({
        region: AWS_REGION,
        accessKeyId: AWS_ACCESSKEYID,
        secretAccessKey: AWS_SECRETACCESSKEY,
    });
};
const uploadBufer = async ({ buffer, mimetype, originalFilename }) => {
    createAWS();
    const s3 = new aws.S3({ apiVersion: 'latest' });
    const Key = `${AWS_BUCKET_PREFIX || ''}${originalFilename.replace(/ /g, '')}`;
    await new Promise((resolve, reject) => {
        s3.upload({
            ContentType: mimetype,
            Bucket: AWS_BUCKET,
            Key,
            Body: buffer,
        }, (err, res) => {
            if (err) {
                return reject(err);
            }
            return resolve(res);
        });
    });
    return Key;
};
exports.uploadBufer = uploadBufer;
const uploadFile = async (file) => {
    const buffer = await fs.readFileSync(file.filepath);
    return (0, exports.uploadBufer)({ buffer, mimetype: file.mimetype, originalFilename: file.originalFilename });
};
exports.uploadFile = uploadFile;
const readFile = async (key) => {
    const s3 = new aws.S3({ apiVersion: 'latest' });
    return new Promise((resolve, reject) => {
        s3.getObject({
            Bucket: AWS_BUCKET,
            Key: key,
        }, (error, response) => {
            if (error) {
                if (error.code === 'NoSuchKey' && error.message.includes('key does not exist')) {
                    console.error(`Error occurred when fetching s3 file with key: "${key}"`);
                }
                return reject(error);
            }
            return resolve(response.Body);
        });
    });
};
exports.readFile = readFile;
const getObject = (Key) => {
    const s3 = new aws.S3({ apiVersion: 'latest' });
    const params = {
        Bucket: AWS_BUCKET,
        Key
    };
    return new Promise((resolve, reject) => {
        s3.getObject(params, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data.Body);
            }
        });
    });
};
exports.getObject = getObject;
const signRequestForUpload = async ({ fileName, fileType }) => {
    const s3 = new aws.S3({ apiVersion: 'latest' });
    const fileExt = pathModule.extname(fileName);
    const fileNameWithoutExtension = pathModule.basename(fileName, fileExt);
    const randomString20 = Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 12);
    const key = `${fileNameWithoutExtension}-${randomString20}${fileExt}`;
    const params = {
        Bucket: AWS_BUCKET,
        Key: key,
        Expires: 300,
        ContentType: fileType,
    };
    return new Promise((resolve, reject) => {
        s3.getSignedUrl('putObject', params, (err, data) => {
            const returnedDataFromS3 = {
                signedRequest: data,
                path: key,
                url: `https://${AWS_BUCKET}.s3.amazonaws.com/${key}`,
            };
            if (err) {
                reject(err);
            }
            else {
                resolve(returnedDataFromS3);
            }
        });
    });
};
exports.signRequestForUpload = signRequestForUpload;
