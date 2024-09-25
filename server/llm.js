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
exports.aiAssistantAnalyzeContent = exports.aiAssistantModifyText = exports.generateSummary = exports.getBulletPoints = exports.createEmbeddingJina = exports.createEmbedding = exports.summarizeJobDescription = exports.prepareResumeForEmbedding = exports.extractWorkHistory = exports.createResumeEmbedding = exports.parseCV = exports.createEmbeddingsOpenAI = void 0;
const axios_1 = __importDefault(require("axios"));
const openai_1 = require("openai");
const dotenv = __importStar(require("dotenv"));
const template_1 = __importDefault(require("lodash/template"));
const Candidates_1 = __importDefault(require("./models/Candidates"));
const Prompts_1 = require("./models/Prompts");
const Summaries_1 = __importDefault(require("./models/Summaries"));
const TemplatePrompts_1 = __importDefault(require("./models/TemplatePrompts"));
const utils_1 = require("./utils");
dotenv.config();
const { OPENAI_API_KEY, FIREWORKS_API_TOKEN, JINA_API_TOKEN } = process.env;
const configuration = new openai_1.Configuration({
    apiKey: OPENAI_API_KEY,
});
const openai = new openai_1.OpenAIApi(configuration);
const createEmbeddingsOpenAI = async (inputText) => {
    try {
        const response = await openai.createEmbedding({
            model: "text-embedding-ada-002",
            input: inputText,
        });
        const embeddings = response.data.data[0].embedding;
        return embeddings;
    }
    catch (error) {
        console.error("Error generating embeddings:", error);
        throw error;
    }
};
exports.createEmbeddingsOpenAI = createEmbeddingsOpenAI;
const parseCV = async (content) => {
    try {
        const prompt = await Prompts_1.Prompts.findOne({ name: 'parse-cv' });
        if (!prompt) {
            throw new Error('Parse CV prompt is not found');
        }
        const { text } = await fetchLLM({
            system: prompt.system,
            user: prompt.user,
        }, { content }, { jsonResult: true });
        return JSON.parse(text);
    }
    catch (e) {
        console.error('Error during parse CV ==========', e.response ? e.response.data.error.message : e);
    }
};
exports.parseCV = parseCV;
const createResumeEmbedding = async ({ resumes, prevValue, candidateId }) => {
    let resumeContentTruncatedContent = '';
    let resumeContentWholeContent = '';
    let resumeEmbedding = [];
    let resumeContentForEmbedding = '';
    if (resumes && resumes.length > 0) {
        const { wholeContent, truncatedContent } = await (0, utils_1.extractPdf)(resumes[0].url);
        resumeContentTruncatedContent = truncatedContent;
        resumeContentWholeContent = wholeContent;
        if (!prevValue || (prevValue && prevValue.resumeContentWholeContent !== resumeContentWholeContent)) {
            try {
                resumeContentForEmbedding = await (0, exports.prepareResumeForEmbedding)(resumeContentWholeContent);
                resumeEmbedding = await (0, exports.createEmbedding)(resumeContentForEmbedding);
            }
            catch (e) {
                console.log(`Error during create embedding ${e.message}`);
            }
        }
    }
    await Candidates_1.default.updateOne({ _id: candidateId }, {
        $set: {
            resumeContentTruncatedContent,
            resumeContentWholeContent,
            resumeEmbedding,
            resumeContentForEmbedding
        }
    });
};
exports.createResumeEmbedding = createResumeEmbedding;
const extractWorkHistory = async (candidateId) => {
    try {
        const candidate = await Candidates_1.default.findOne({ _id: candidateId });
        if (!candidate.resumeContentWholeContent) {
            return;
        }
        const prompt = await Prompts_1.Prompts.findOne({ name: 'extract-work-history' });
        if (!prompt) {
            throw new Error('Extact work history prompt is not found');
        }
        const { text } = await fetchLLM({ system: prompt.system, user: prompt.user }, { resumeContentWholeContent: candidate.resumeContentWholeContent }, { jsonResult: true });
        const prevWorkHistories = candidate.workHistories || [];
        const workHistories = JSON.parse(text);
        for (const workHistory of workHistories) {
            const item = prevWorkHistories.find(wh => wh.title === workHistory.title && wh.employer === workHistory.employer);
            if (!item) {
                prevWorkHistories.push(Object.assign({ _id: Math.random() }, workHistory));
            }
        }
        await Candidates_1.default.updateOne({ _id: candidateId }, { $set: { workHistories: prevWorkHistories } });
    }
    catch (e) {
        console.error('Error during extract work history ==========', e.response ? e.response.data.error.message : e);
    }
};
exports.extractWorkHistory = extractWorkHistory;
const prepareResumeForEmbedding = async (resumeContent) => {
    try {
        const prompt = await Prompts_1.Prompts.findOne({ name: 'prepare-resume-for-embedding' });
        if (!prompt) {
            throw new Error('Prepare resume for embedding prompt is not found');
        }
        const { text } = await fetchLLM({
            system: prompt.system,
            user: prompt.user,
        }, {
            resumeContent,
        }, { jsonResult: true });
        return text;
    }
    catch (e) {
        console.error('Error during extract work history ==========', e.response ? e.response.data.error.message : e);
    }
};
exports.prepareResumeForEmbedding = prepareResumeForEmbedding;
const summarizeJobDescription = async (jobDescription) => {
    try {
        const prompt = await Prompts_1.Prompts.findOne({ name: 'summarize-job-description-for-embedding' });
        if (!prompt) {
            throw new Error('Summarize job description for embedding prompt is not found');
        }
        const { text } = await fetchLLM({
            system: prompt.system,
            user: prompt.user,
        }, { jobDescription }, { jsonResult: true });
        return text;
    }
    catch (e) {
        console.error('Error during summarize job description ==========', e.response ? e.response.data.error.message : e);
    }
};
exports.summarizeJobDescription = summarizeJobDescription;
const fetchFireworksAPI = async (prompt, templateVariables, options) => {
    var _a, _b;
    const { jsonResult } = options || {};
    const userPrompt = (0, template_1.default)(prompt.user)(templateVariables);
    const systemPrompt = (0, template_1.default)(prompt.system)(templateVariables);
    const inputPrompt = { userPrompt, systemPrompt };
    const response = await axios_1.default.request({
        method: 'POST',
        url: 'https://api.fireworks.ai/inference/v1/chat/completions',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: `Bearer ${FIREWORKS_API_TOKEN}`
        },
        data: {
            model: "accounts/fireworks/models/llama-v3-70b-instruct",
            messages: [
                {
                    role: 'system',
                    content: systemPrompt,
                },
                {
                    role: "user",
                    content: userPrompt,
                }
            ],
            temperature: 0,
            stop: null,
            response_format: { type: 'text' },
            stream: false
        }
    });
    const text = ((_b = (_a = response.data.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) || "";
    if (jsonResult) {
        return {
            inputPrompt,
            json: response.data.usage,
            text,
        };
    }
    return { inputPrompt, text };
};
const createEmbedding = async (text) => {
    try {
        const response = await axios_1.default.request({
            method: 'POST',
            url: 'https://api.fireworks.ai/inference/v1/embeddings',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                authorization: `Bearer ${FIREWORKS_API_TOKEN}`
            },
            data: {
                model: "nomic-ai/nomic-embed-text-v1.5",
                input: text
            }
        });
        return response.data.data[0].embedding;
    }
    catch (e) {
        throw new Error(e.response ? e.response.data.error.message : e);
    }
};
exports.createEmbedding = createEmbedding;
const createEmbeddingJina = async (text) => {
    const response = await axios_1.default.request({
        method: 'POST',
        url: 'https://api.jina.ai/v1/embeddings',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: `Bearer ${JINA_API_TOKEN}`
        },
        data: {
            input: [text],
            model: "jina-embeddings-v2-base-en",
            encoding_type: "float"
        }
    });
    return response.data.data[0].embedding;
};
exports.createEmbeddingJina = createEmbeddingJina;
const fetchLLM = async (prompt, templateVariables, options) => {
    return fetchFireworksAPI(prompt, templateVariables, options);
};
const getBulletPoints = async (job) => {
    const { customBulletPoints } = job || {};
    const educationLevel = await TemplatePrompts_1.default.findOne({ name: 'Education level', isPrebuilt: true }).lean();
    const jobTitle = await TemplatePrompts_1.default.findOne({ name: 'Job title', isPrebuilt: true }).lean();
    const skills = await TemplatePrompts_1.default.findOne({ name: 'Skills', isPrebuilt: true }).lean();
    const physicalLocation = await TemplatePrompts_1.default.findOne({ name: 'Physical location', isPrebuilt: true }).lean();
    const defaultBulletPoints = [educationLevel, jobTitle, skills, physicalLocation].filter(value => value);
    return customBulletPoints && Object.keys(customBulletPoints).length > 0 ? customBulletPoints : defaultBulletPoints;
};
exports.getBulletPoints = getBulletPoints;
const evaluate = async ({ resumeContent, jobDetailText, jobTitle, bulletPoints, }) => {
    const prompts = await Prompts_1.Prompts.find().setOptions({ lean: true });
    const prompt = prompts.find(p => p.name === 'summary-default');
    let systemPrompt = prompt.system;
    let userPrompt = prompt.user;
    let prompTexts = '';
    let exampleResponses = '';
    let index = 0;
    for (const bp of bulletPoints) {
        index++;
        prompTexts = `${prompTexts}
      ${index}) ${bp.promptText || ''}
    `;
        exampleResponses = `${exampleResponses}

      ${index}) ${bp.exampleResponse || ''}
    `;
    }
    systemPrompt = systemPrompt.replace('{{ prompts }}', prompTexts);
    userPrompt = userPrompt.replace('{{ prompts }}', exampleResponses);
    let response;
    try {
        const { inputPrompt, text, json } = await fetchLLM(Object.assign(Object.assign({}, prompt), { system: systemPrompt, user: userPrompt }), {
            jobDetailText,
            jobTitle,
            resumeContent,
        }, { jsonResult: true });
        response = { inputPrompt, text, json };
    }
    catch (e) {
        console.error('Error during evaluate ==========', e.response ? e.response.data.error.message : e);
        response = {
            text: 'Summary was not generated due to error: ' +
                `${e.response ? e.response.data.error.message : e}`,
        };
    }
    return response;
};
const sendRatingRequest = async ({ summaryResult, resumeContent, jobDetailText, }) => {
    let response = {};
    try {
        const prompt = await Prompts_1.Prompts.findOne({ name: 'rating' });
        if (!prompt) {
            throw new Error('Rating prompt is not found');
        }
        const { inputPrompt, text, json } = await fetchLLM(prompt, {
            jobDetailText,
            resumeContent,
            summary: summaryResult,
        }, { jsonResult: true });
        response.ratingInputPrompt = inputPrompt;
        response.ratingResponseText = text;
        response.ratingJSON = json;
    }
    catch (e) {
        console.error('Error during rating ==========', e.response ? e.response.data.error.message : e);
        response.ratingResponseText = 'Rating was not generated due to error: ' +
            `${e.response ? e.response.data.error.message : e}`;
    }
    return response;
};
const generateSummary = async ({ user, job, candidate }) => {
    const userId = user._id;
    const selector = { userId, jobId: job._id, applicantId: candidate._id };
    const doc = {
        userId,
        jobId: job._id,
        applicantId: candidate._id,
        status: 'startedProcessing',
    };
    if ((await Summaries_1.default.find(selector).countDocuments()) === 0) {
        await Summaries_1.default.createSummary(doc);
    }
    else {
        await Summaries_1.default.updateOne(selector, { $set: doc });
    }
    const summary = await Summaries_1.default.findOne(selector);
    await Summaries_1.default.updateOne({ _id: summary._id }, { $set: {
            wholeContent: candidate.resumeContentWholeContent,
            truncatedContent: candidate.resumeContentTruncatedContent
        }
    });
    const updatedSummary = await Summaries_1.default.findOne({ _id: summary._id });
    const resumeContent = updatedSummary.truncatedContent;
    const jobDetailText = job.description;
    const { text, inputPrompt, json, apiProvider } = await evaluate({
        resumeContent,
        jobDetailText,
        jobTitle: job.title,
        bulletPoints: await (0, exports.getBulletPoints)(job),
    });
    const array = text.split(/\r?\n|\r|\n/g);
    const reasoning = array[array.length - 1];
    if (reasoning) {
        const setDoc = {
            inputPrompt,
            llmResponseJSON: json,
            status: 'evaluated',
            error: '',
            apiProvider,
        };
        sendRatingRequest({ resumeContent, jobDetailText, summaryResult: text }).then(({ ratingInputPrompt, ratingResponseText, ratingJSON }) => {
            Summaries_1.default.updateOne({ _id: summary._id }, {
                $set: {
                    ratingInputPrompt,
                    ratingResponseText,
                    llmRatingResponseJSON: ratingJSON,
                }
            }).then(() => { }).catch((e) => console.log(e));
        });
        await Summaries_1.default.updateOne({ _id: summary._id }, { $set: Object.assign(Object.assign({}, setDoc), { responseText: text }) });
    }
};
exports.generateSummary = generateSummary;
const aiAssistantModifyText = async (tool, orginalText) => {
    const prompt = await Prompts_1.Prompts.findOne({ name: `ai-assistant-${tool}` });
    try {
        const { text } = await fetchLLM({ system: prompt.system, user: prompt.user }, { text: orginalText }, { jsonResult: true });
        return JSON.parse(text).text;
    }
    catch (e) {
        console.error('Error during ai editor ==========', e.response ? e.response.data.error.message : e);
    }
};
exports.aiAssistantModifyText = aiAssistantModifyText;
const aiAssistantAnalyzeContent = async (content) => {
    try {
        const prompt = await Prompts_1.Prompts.findOne({ name: 'ai-assistant-analyze-content' });
        if (!prompt) {
            throw new Error('AI assistant analyze content prompt is not found');
        }
        const { text } = await fetchLLM({
            system: prompt.system,
            user: prompt.user,
        }, { content }, { jsonResult: true });
        return text;
    }
    catch (e) {
        console.error('Error during ai editor ==========', e.response ? e.response.data.error.message : e);
    }
};
exports.aiAssistantAnalyzeContent = aiAssistantAnalyzeContent;
