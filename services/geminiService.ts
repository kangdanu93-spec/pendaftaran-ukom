import { GoogleGenAI } from "@google/genai";

export const generateTeamName = async (className: string, leaderName: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      Buatkan 1 nama tim yang kreatif dan keren untuk kelompok siswa sekolah jurusan Multimedia.
      Kelas: ${className}
      Nama Ketua: ${leaderName}
      
      Hanya berikan nama timnya saja tanpa tanda kutip atau penjelasan tambahan.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text?.trim() || "Tim Multimedia";
  } catch (error) {
    console.error("Error generating team name:", error);
    throw error;
  }
};