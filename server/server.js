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
const dotenv = __importStar(require("dotenv"));
const next_1 = __importDefault(require("next"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const formidable = __importStar(require("formidable"));
const cors_1 = __importDefault(require("cors"));
const utils_1 = require("./utils");
const jobs_1 = __importDefault(require("./apis/jobs"));
const portal_1 = __importDefault(require("./apis/portal"));
const candidates_1 = __importDefault(require("./apis/candidates"));
const common_1 = __importDefault(require("./apis/common"));
const emails_1 = __importDefault(require("./apis/emails"));
const integrations_1 = __importDefault(require("./apis/integrations"));
const clients_1 = __importDefault(require("./apis/clients"));
const google_1 = __importDefault(require("./apis/google"));
const extension_1 = __importDefault(require("./apis/extension"));
const extensionMiddleware_1 = __importDefault(require("./middlewares/extensionMiddleware"));
const auth_1 = __importDefault(require("./apis/auth"));
const payment_1 = require("./payment");
const User_1 = __importDefault(require("./models/User"));
const Candidates_1 = __importDefault(require("./models/Candidates"));
const connection_1 = require("./connection");
const aws_s3_1 = require("./aws-s3");
const stream_1 = require("stream");
const Prompts_1 = require("./models/Prompts");
const llm_1 = require("./llm");
const Organizations_1 = __importDefault(require("./models/Organizations"));
const utils_2 = require("./utils");
dotenv.config();
const { NODE_ENV, PORT = 3000, URL_APP, } = process.env;
const dev = NODE_ENV !== 'production';
const app = (0, next_1.default)({ dev });
const handle = app.getRequestHandler();
app.prepare().then(async () => {
    await (0, connection_1.dbConnect)();
    await (0, Prompts_1.insertPromptTemplates)();
    const server = (0, express_1.default)();
    server.use((0, cors_1.default)({
        credentials: true,
        origin: utils_2.allowedOrigins
    }));
    server.post('/stripe/webhook', (0, utils_1.routeErrorHandling)(payment_1.webhook));
    server.use(express_1.default.json());
    server.use((0, cookie_parser_1.default)());
    server.use((0, express_session_1.default)({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: connect_mongo_1.default.create({ mongoUrl: process.env.MONGO_URL, stringify: false }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7,
        },
    }));
    server.use(passport_1.default.initialize());
    server.use(passport_1.default.session());
    server.get('/get-user', (0, utils_1.routeErrorHandling)(async (req, res) => {
        if (!URL_APP.includes(req.hostname)) {
        }
        if (req.user) {
            const dbUser = await User_1.default.findOne({ _id: req.user._id });
            const organization = await Organizations_1.default.findOne({ _id: dbUser.organizationId });
            const user = {
                organizationId: organization ? organization._id.toString() : null,
                organizationName: organization ? organization.name : null,
                organizationSubdomain: organization ? organization.subdomain : null,
            };
            for (const field of User_1.default.publicFields()) {
                user[field] = dbUser[field];
            }
            return res.json({ user });
        }
        return res.json({ user: null });
    }));
    server.use(extensionMiddleware_1.default);
    (0, common_1.default)({ server });
    (0, integrations_1.default)({ server });
    (0, emails_1.default)({ server });
    (0, jobs_1.default)({ server });
    (0, candidates_1.default)({ server });
    (0, clients_1.default)({ server });
    (0, google_1.default)({ server });
    (0, payment_1.routes)({ server });
    (0, extension_1.default)({ server });
    (0, portal_1.default)({ server });
    server.post('/upload-file', async (req, res) => {
        const form = new formidable.IncomingForm();
        form.parse(req, async (_error, _fields, response) => {
            const files = response.file || response.upload;
            try {
                const result = await (0, aws_s3_1.uploadFile)(files[0]);
                return res.json({ result });
            }
            catch (e) {
                return res.status(500).send(e.message);
            }
        });
    });
    server.post('/sign-request-for-upload', async (req, res) => {
        const { fileName, fileType } = req.body;
        const response = await (0, aws_s3_1.signRequestForUpload)({
            fileName,
            fileType,
        });
        return res.json(response);
    });
    server.get('/read-file', async (req, res) => {
        try {
            const key = req.query.key;
            const response = await (0, aws_s3_1.readFile)(key);
            const fileStream = new stream_1.Readable();
            fileStream.push(response);
            fileStream.push(null);
            fileStream.pipe(res);
        }
        catch (e) {
            return console.error(e);
        }
    });
    (0, auth_1.default)({ server });
    server.get('/check-expiring-cards', async (_req, res) => {
        await (0, payment_1.checkExpiringCards)();
        return res.send('ok');
    });
    server.get('/create-embeddings-batch', async (_req, res) => {
        const candidates = await Candidates_1.default.find({
            $and: [
                { resumeContentWholeContent: { $exists: true } },
                { resumeContentWholeContent: { $ne: null } },
                { resumeContentWholeContent: { $ne: '' } }
            ]
        });
        let api = llm_1.createEmbedding;
        for (const candidate of candidates) {
            const embeddingContent = await (0, llm_1.prepareResumeForEmbedding)(candidate.resumeContentWholeContent);
            const embedding = await api(embeddingContent);
            console.log(embedding.length);
            await Candidates_1.default.updateOne({ _id: candidate._id }, { $set: {
                    resumeContentForEmbedding: embeddingContent,
                    resumeEmbedding: embedding
                }, $unset: { resumeContentEmbedding: 1 } });
        }
        return res.send('ok');
    });
    server.use((err, _req, res, _next) => {
        console.error(err);
        return res.status(500).json({ serverError: err.message });
    });
    server.get('*', (req, res) => {
        handle(req, res);
    });
    server.listen(PORT, async () => {
        console.log(`> Ready on ${PORT}`);
    });
});
