
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, ProgrammingLanguage, ChatMessage, OutputMode, QuizQuestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ANALYSIS_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    detectedType: {
      type: Type.STRING,
      enum: ['code', 'diagram', 'math', 'notes'],
      description: "The identified content type of the whiteboard.",
    },
    suggestedLanguage: {
      type: Type.STRING,
      description: "The most appropriate programming language.",
    },
    reasoning: {
        type: Type.STRING,
        description: "Why this type and language were chosen.",
    },
    title: {
      type: Type.STRING,
      description: "A short, descriptive title.",
    },
    transcription: {
      type: Type.STRING,
      description: "Raw transcription of text and logic seen on the whiteboard.",
    },
    explanation: {
      type: Type.STRING,
      description: "Detailed natural language summary and walkthrough in Markdown format.",
    },
    code: {
      type: Type.STRING,
      description: "Executable code implementation (if applicable).",
    },
    diagram: {
      type: Type.STRING,
      description: "Mermaid.js diagram code (if applicable).",
    },
    flashcards: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          term: { type: Type.STRING, description: "Front of card: A specific question or concept name" },
          definition: { type: Type.STRING, description: "Back of card: The answer/definition" },
        },
        required: ["term", "definition"],
      },
      description: "3-5 key learning concepts formatted as Question/Answer pairs.",
    },
    secondaryInfo: {
      type: Type.OBJECT,
      properties: {
        complexity: { type: Type.STRING },
        edgeCases: { type: Type.ARRAY, items: { type: Type.STRING } },
        relatedConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: [],
    },
  },
  required: ["detectedType", "suggestedLanguage", "reasoning", "title", "transcription", "explanation", "secondaryInfo"],
};

const QUIZ_SCHEMA: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: { type: Type.STRING },
      options: { 
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Provide exactly 4 options."
      },
      correctAnswerIndex: { 
        type: Type.INTEGER,
        description: "The index (0-3) of the correct option." 
      },
      explanation: { type: Type.STRING, description: "Why this answer is correct." }
    },
    required: ["question", "options", "correctAnswerIndex", "explanation"]
  }
};

export const analyzeWhiteboard = async (
  images: { base64: string; mimeType: string }[],
  language: ProgrammingLanguage,
  mode: OutputMode = 'auto',
  refinementInstruction?: string
): Promise<AnalysisResult> => {
  try {
    const parts = images.map((img) => ({
      inlineData: {
        data: img.base64,
        mimeType: img.mimeType,
      },
    }));

    let modeInstruction = "";
    switch (mode) {
      case 'code':
        modeInstruction = "Focus on extracting algorithms and generating clean code.";
        break;
      case 'diagram':
        modeInstruction = "Focus on system design. Generate a clear Mermaid diagram and explain the flow.";
        break;
      case 'math':
        modeInstruction = "Solve the math problem step-by-step with LaTeX.";
        break;
      case 'notes':
        modeInstruction = "Summarize the content as study notes.";
        break;
      default:
        modeInstruction = "Detect the content type automatically.";
        break;
    }

    const langInstruction = language !== 'Auto' 
      ? `Output code in ${language}.` 
      : `Choose the best language for the code.`;

    const refinement = refinementInstruction 
      ? `IMPORTANT REFINEMENT: ${refinementInstruction}` 
      : "";

    const promptText = `
      Analyze these whiteboard images.
      ${modeInstruction}
      ${langInstruction}
      ${refinement}
      
      Tasks:
      1. Transcribe what you see.
      2. Explain the logic in simple terms (Student-friendly, use Markdown).
      3. Generate WORKING CODE (even if it's a diagram, implement the logic).
      4. Generate a MERMAID DIAGRAM (if applicable).
      5. Create 3-5 high-quality Flashcards.
      6. Fill all schema fields.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: {
        parts: [...parts, { text: promptText }],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA,
        thinkingConfig: { thinkingBudget: 32768 },
        systemInstruction: "You are BoardToCode AI, an elite technical architect. Convert sketches to high-quality code and architectural diagrams. Always be precise, educational, and clean.",
      },
    });

    if (!response.text) {
      throw new Error("No response text received from Gemini");
    }

    return JSON.parse(response.text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

export const generateQuiz = async (context: string): Promise<QuizQuestion[]> => {
    try {
        const prompt = `
            Based on the following content, generate 5 multiple-choice questions to test understanding.
            Content:
            """${context.substring(0, 8000)}"""
        `;

        const response = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: {
                parts: [{ text: prompt }]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: QUIZ_SCHEMA,
                systemInstruction: "Create a rigorous but fair quiz based on the provided content."
            }
        });

        if (!response.text) throw new Error("Failed to generate quiz");
        
        const questions = JSON.parse(response.text) as any[];
        return questions.map((q, index) => ({
            id: `q-${Date.now()}-${index}`,
            ...q
        }));
    } catch (error) {
        console.error("Quiz Generation Error:", error);
        throw error;
    }
};

export const sendFollowUpMessage = async (
  history: ChatMessage[],
  newMessage: string,
  currentContext: string,
  contextImages: { base64: string; mimeType: string }[]
): Promise<string> => {
  try {
    const systemInstruction = `
      You are BoardToCode Copilot.
      Context: ${currentContext.substring(0, 10000)}
      Help the user refine their code, explain concepts, or troubleshoot.
    `;

    const contents = history.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    }));

    const lastParts: any[] = [{ text: newMessage }];
    if (newMessage.toLowerCase().includes("image") || newMessage.toLowerCase().includes("sketch")) {
       contextImages.forEach(img => {
           lastParts.push({ inlineData: { data: img.base64, mimeType: img.mimeType } });
       });
    }

    const chat = ai.chats.create({
      model: "gemini-3-pro-preview",
      config: { systemInstruction },
      history: contents,
    });

    const response = await chat.sendMessage({ message: lastParts });
    return response.text || "I'm not sure how to respond to that.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "I encountered an error processing your request.";
  }
};
