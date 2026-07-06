const SearchBar = ({ company, setCompany, analyzeCompany }) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Enter Company Name"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />

      <button onClick={analyzeCompany}>
        Analyze
      </button>
    </div>
  );
};

export default SearchBar;