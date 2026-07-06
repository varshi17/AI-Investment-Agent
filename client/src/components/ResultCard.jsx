const ResultCard = ({ result }) => {
  return (
    <div>
      <h2>{result.company}</h2>

      <h3>{result.recommendation}</h3>

      <p>{result.summary}</p>

      <h4>Confidence : {result.confidence}</h4>

      <h4>Financial Score : {result.financialHealth.score}</h4>

      <p>{result.financialHealth.reason}</p>
    </div>
  );
};

export default ResultCard;