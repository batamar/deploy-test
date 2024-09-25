"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prompts = exports.insertPromptTemplates = exports.PromptSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class PromptClass extends mongoose_1.default.Model {
}
exports.PromptSchema = new mongoose_1.default.Schema({
    name: { type: String },
    system: { type: String },
    user: { type: String },
});
exports.PromptSchema.loadClass(PromptClass);
const Prompts = mongoose_1.default.model('prompts', exports.PromptSchema);
exports.Prompts = Prompts;
async function insertPromptTemplates() {
    const templates = [
        {
            name: 'summary-default',
            system: `
        You are an experienced recruiter in the biotech industry responsible for hiring the best job applicant for the job by summarizing the job applicant's resume.

        Your task is to compare the job applicant's resume to the job description on the following parameters:

        {{ prompts }}

        ------

        Respond in a helpful tone, with very concise answers.
      `,
            user: `
        Review the job applicant's resume. Find and mention all of the above parameters.
        
        See the job applicant's resume below.
        
        <!--start-resume-->
        <%= resumeContent %>
        <!--end-resume-->
    
        Use the below example response, your response should contain similar structure.
    
        <!--start-example-response-->

        {{ prompts }}

        <!--end-example-response-->
      `
        },
        {
            name: 'job-default',
            system: `
        You are an experienced recruiter in the biotech industry responsible for improving the job description.
        Your task is to extract the following parameters from the job description:
        - educationLevel: Education level. Extract education level required for the job from the job description. Example values for educational level: "Postdoctoral Fellow", "M.D.", "Ph.D.", "Pharm.D.", "M.S.", "B.S.", "A.S.", "M.S. in Bioengineering", "PhD in Bioinformatics" and other values.
        - jobSkills: Skills. Extract skills from the job description that are related to research, laboratory and technology. Example values for skills: "Flow cytometry", "PCR", "CHIP-seq", "Brain dissection", "NGS-based assays", "target discovery", "PreSeq software", "Max Reads assay", "cell culturing", "Python". Mention hard skills and don't mention soft skills. Indicate one or two skills that are mentioned most frequently in the job description.

      `,
            user: `
        See the job description below.
        
        <!--start-job-description-->
        <%= jobDetailText %>
        <!--end-job-description-->
    
        Return JSON object with two keys: "educationLevel" (type: string) and "jobSkills" (type: array of strings). 
        
        Use the below two example responses, your response should contain similar structure and data types.
    
        Example 1:
        <!--start-example-1-response-->
        {
          "educationLevel":"PhD in  Bioinformatics, Computational Biology",
          "jobSkills":["FACS", "NGS", "RNA-seq", "qPCR", "adenoviral", "Python"]
        }
        <!--end-example-1-response-->

        Example 2:
        <!--start-example-2-response-->
        {
          "educationLevel":"MS, Chemistry",
          "jobSkills":["HPLC", "Flow Cytometry", "PCR", "protein purification ", "Tissue Culture"]
        }
        <!--end-example-2-response-->
      `
        },
        {
            name: 'rating',
            system: `
          You are a recruiter in biotech industry responsible for hiring the best job applicant for the job.
          You evaluate the job applicant's resume summary by comparing it to the job description.
          You have to score the job applicant's fitness for the job, the score value must be between 0 and 10. 0 if job candidate is not fit for the job. 10 is job candidate is a perfect fit for the job.
          The response must be an integer. Explain score.
        `,
            user: `
          See the job description below.

          <!--start-job-description-->
          <%= jobDetailText %>
          <!--end-job-description-->

          See resume summary below.

          <!--start-resume-summary-->
          <%= summary %>
          <!--end-resume-summary-->
        `
        },
        {
            name: 'parse-cv',
            system: `Your task is to extract personal information from the job applicant's resume`,
            user: `
        Review the job applicant's resume.
        
        Please provide a JSON list with the following structure. Respond only with the JSON.stringify-ed string and no additional text

        <!--start-resume-content-->
          <%= content %>
        <!--end-resume-content-->
    
        <!--start-example-response-->
        {
          firstName: "John",
          lastName: "Doe",
          phones: [{ phone: "+97696221050", type: "mobile" }],
          emails: [{ email: "john.doe@gmail.com", type: "personal" }],
          linkedinUrl: "https://www.linkedin.com/in/john-doe",
          githubUrl: "https://github.com/johndoe",
          googleScholarUrl: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=1234567890&citation_for_view=1234567890",
          websiteUrl: "https://www.johndoe.com",
          city: "San Diego",
          state: "California",
        }
        <!--end-example-response-->
      `
        },
        {
            name: 'extract-work-history',
            system: `
        You are an experienced recruiter in the biotech industry responsible for hiring the best job applicant for the job by summarizing the job applicant's resume.
        Your task is to extract work histories information from the job applicant's resume
      `,
            user: `
        Review the job applicant's resume. Find work histories information
        
        Please provide a JSON list with the following structure. Respond only with the JSON.stringify-ed string and no additional text

        <!--start-resume-content-->
          <%= resumeContentWholeContent %>
        <!--end-resume-content-->
    
        <!--start-example-response-->
        [{ title: 'Senior Program Manager', employer: 'Sentynl Therapeutics, Inc', startDateMonth: 6, startDateYear: 2022, endDateMonth: 7, endDateYear: 2023, isCurrent: false, locationCountry: 'United States', locationState: 'California', locationCity: 'San Diego', supervisorName: 'BatAmar', supervisorPhone: '+97696221050', summary: 'Develop and manage project timelines using best practices for project reporting: Critical path analysis, action items, task management, and prompt follow-up' } ]
        <!--end-example-response-->
      `
        },
        {
            name: 'prepare-resume-for-embedding',
            system: `
        I plan to semanticize applicants' resume contents using MongoDB vector search.
        I want to store the applicants' resume content in more detail to improve the query accuracy.
        Your task is to prepare the applicants' resume content for embedding.
        I will provide you the resume content and you should generate collection of simple sentences.
      `,
            user: `
        Review the job applicant's resume.
        
        <!--start-resume-content-->
          <%= resumeContent %>
        <!--end-resume-content-->
      `
        },
        {
            name: 'prepare-job-description-for-embedding',
            system: `
        I am developing applicant tracking system.
        I plan to search applicants by job description using MongoDB vector search.
        I stored applicants' resume content as a vector embedding.
        I plan to use job description as a vector query to search applicants.
        Your task is to remove unrelated details and to summarize the job description in a way that I can use it directly as a vectory query.
        Make sure that you do not include unnecessary texts like 'Here is a summarized version of the job description'
      `,
            user: `
        Review the job description.
        
        <!--start-job-description-->
          <%= jobDescription %>
        <!--end-job-description-->
      `
        },
        {
            name: 'ai-assistant-analyze-content',
            system: `You are a helpfull assistant to improve the text.`,
            user: `
          I am going to provide you some html string to fix grammar mistakes, simplify complex sentences, and improve readability.
          You have to return the updated html string after applying the following rules:

          1. Sentences that are no issues, just return them as is
          2. Wrap sentences that are lengthy or complex with <p class="ai-yellow"> tag
          3. Wrap sentences that are very dense or convoluted with <p class="ai-red"> tag
          4. Wrap sentences that are weakening phrases with <span class="ai-blue"> tag

          <!--start-content-->
           <%= content %>
          <!--end-content-->

          <!--example-response-->
            <p>
              Text with no issues:
            </p>

              <p class="ai-yellow">
                The app highlights lengthy, complex sentences and common errors; if you see a yellow sentence, shorten or split it
              </p>

            <p class="ai-red">
            If you see a red highlight, your sentence is so dense and complicated that your readers will get lost trying to follow its meandering, convoluted logic—try editing this sentence to remove the red highlight
            </p>

            <p>Adverbs, passive voice, and other weakening phrases <span class="ai-blue">are marked</span> in blue. I believe you should replace them with more forceful language.</p>
          <!--end-example-response-->

          Please provide only the answer without any additional information.
        `
        },
        {
            name: 'ai-assistant-shorten-it',
            system: 'You are a helpfull assistant to improve the text.',
            user: `
        Please shorten the following text. Your entire response must be JSON:

        <original-text>
          <%= text %>
        </original-text>

        <example-response>
          {
            "text": "This is a shortened version of the original text."
          }
        </example-response>
      `
        },
        {
            name: 'ai-assistant-more-confident',
            system: 'You are a helpfull assistant to improve the text.',
            user: `
        Please rewrite the following text to sound more confident and assertive. Your entire response must be JSON:

        <original-text>
          <%= text %>
        </original-text>

        <example-response>
          {
            "text": "This is a more confident version of the original text."
          }
        </example-response>
      `
        },
        {
            name: 'ai-assistant-more-friendly',
            system: 'You are a helpfull assistant to improve the text.',
            user: `
        Please rewrite the following text to be more friendly and approachable. Your entire response must be JSON:

        <original-text>
          <%= text %>
        </original-text>

        <example-response>
          {
            "text": "This is a more friendly version of the original text."
          }
        </example-response>
      `
        },
        {
            name: 'ai-assistant-simplify-and-clarify',
            system: 'You are a helpfull assistant to improve the text.',
            user: `
        Please rewrite the following text to be more simple and clear. Your entire response must be JSON:

        <original-text>
          <%= text %>
        </original-text>

        <example-response>
          {
            "text": "This is a more simple and clear version of the original text."
          }
        </example-response>
      `
        }
    ];
    for (const t of templates) {
        const p = await Prompts.findOne({ name: t.name }).setOptions({ lean: true });
        const system = t.system.replace(/\n/g, '').replace(/[ ]+/g, ' ').trim();
        const user = t.user.replace(/\n/g, '').replace(/[ ]+/g, ' ').trim();
        if (!p) {
            await Prompts.create(t);
        }
        else if (p.system !== t.system || p.user !== user) {
            await Prompts.updateOne({ _id: p._id }, { $set: { system, user } }).exec();
        }
    }
}
exports.insertPromptTemplates = insertPromptTemplates;
