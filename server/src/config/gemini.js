// // server/src/config/gemini.js
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// if (!GEMINI_API_KEY) {
//   console.error('❌ GEMINI_API_KEY is not set in environment variables');
// }

// const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// const ai = {
//   models: {
//     generateContent: async ({ model, contents }) => {
//       const geminiModel = genAI.getGenerativeModel({ model });
//       const result = await geminiModel.generateContent(contents);
//       return {
//         text: result.response.text(),
//       };
//     },
//   },
// };

// export default ai;




// server/src/config/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY is not set in environment variables');
  console.error('Please add GEMINI_API_KEY to your .env file');
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Create a wrapper for the Gemini API
const ai = {
  models: {
    generateContent: async ({ model, contents }) => {
      try {
        const geminiModel = genAI.getGenerativeModel({ model });
        const result = await geminiModel.generateContent(contents);
        return {
          text: result.response.text(),
        };
      } catch (error) {
        console.error('❌ Gemini API Error:', error);
        throw new Error(`Gemini API error: ${error.message}`);
      }
    },
  },
};

export default ai;