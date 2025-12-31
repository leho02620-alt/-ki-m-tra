
import { GoogleGenAI, Type } from "@google/genai";
import { Grade, Level, QuestionType, AiModel } from "../types";

const FALLBACK_MODELS: AiModel[] = [
  'gemini-3-flash-preview',
  'gemini-3-pro-preview',
  'gemini-2.5-flash'
];

export const generateQuestionWithAI = async (
  apiKey: string,
  preferredModel: AiModel,
  grade: Grade,
  topic: string,
  level: Level,
  type: QuestionType
) => {
  const modelsToTry = [preferredModel, ...FALLBACK_MODELS.filter(m => m !== preferredModel)];
  let lastError = '';

  for (const modelName of modelsToTry) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Hãy tạo một câu hỏi Toán THCS cho lớp ${grade}, chủ đề "${topic}", mức độ "${level}", thể loại "${type}". 
      Yêu cầu:
      - Nếu là trắc nghiệm: cung cấp 4 phương án A, B, C, D.
      - Nếu là tự luận: cung cấp lời giải chi tiết và đáp số cuối cùng.
      - Ngôn ngữ: Tiếng Việt.
      - Trả về kết quả chính xác theo cấu trúc JSON.`;

      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              content: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Chỉ dành cho trắc nghiệm, mảng 4 chuỗi A..., B..., C..., D..."
              },
              correctAnswer: { type: Type.STRING, description: "A/B/C/D nếu là trắc nghiệm, hoặc kết quả ngắn nếu là tự luận" },
              explanation: { type: Type.STRING }
            },
            required: ["content", "correctAnswer", "explanation"]
          }
        }
      });

      if (!response.text) {
        throw new Error("API returned empty text");
      }

      return JSON.parse(response.text);
    } catch (error: any) {
      console.warn(`Model ${modelName} failed. Error: ${error.message}`);
      lastError = error.message;
      // If it's an API key error, don't retry with other models as it's likely a global issue
      if (error.message.includes("API key")) {
        throw new Error(error.message);
      }
      continue; // Try next model
    }
  }

  throw new Error(`Tất cả model đều thất bại. Lỗi cuối cùng: ${lastError}`);
};
