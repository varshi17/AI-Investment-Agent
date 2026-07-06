import express from "express";
import cors from "cors";
import analyzeRoutes from "./routes/analyzeRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "AI Investment Research Agent API Running 🚀",
  });
});

app.use("/api/analyze", analyzeRoutes);

export default app;