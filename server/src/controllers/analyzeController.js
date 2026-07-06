import { analyzeWithGemini } from "../services/geminiService.js";

export const analyzeCompany = async (req, res) => {
    try {
        const { company } = req.body;

        if (!company || company.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Company name is required",
            });
        }

        const analysis = await analyzeWithGemini(company);

        return res.status(200).json({
            success: true,
            data: analysis,
        });

    } catch (error) {
        console.error("Gemini Error:", error);

        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};