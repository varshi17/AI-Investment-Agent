import { useState } from "react";
import api from "../api/api";
import SearchBar from "../components/SearchBar";
import ResultCard from "../components/ResultCard";

const Home = () => {
  const [company, setCompany] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeCompany = async () => {
    if (!company.trim()) return;

    try {
      setLoading(true);

      const response = await api.post("/analyze", {
        company,
      });

      setResult(response.data.data);
    } catch (error) {
      console.log(error);
      alert("Analysis Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>AI Investment Research Agent</h1>

      <SearchBar
        company={company}
        setCompany={setCompany}
        analyzeCompany={analyzeCompany}
      />

      {loading && <h2>Analyzing...</h2>}

      {result && <ResultCard result={result} />}
    </div>
  );
};

export default Home;