import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({
    numbers: false,
    alphabets: false,
    highestAlphabet: false
  });
  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleSelectChange = (event) => {
    const { name, checked } = event.target;
    setSelectedOptions(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async () => {
    try {
      const data = JSON.parse(input);  // Ensure the input is valid JSON
      const result = await axios.post('http://localhost:3001/bfhl', data);
      setResponse(result.data);
      setError(null);
    } catch (err) {
      setError('Invalid JSON input or server error');
      setResponse(null);
    }
  };
  

  const renderResponse = () => {
    if (!response) return null;
    
    const filteredData = {};
    if (selectedOptions.numbers) filteredData.numbers = response.numbers;
    if (selectedOptions.alphabets) filteredData.alphabets = response.alphabets;
    if (selectedOptions.highestAlphabet) filteredData.highest_alphabet = response.highest_alphabet;
    
    return (
      <div>
        <h3>Response:</h3>
        <pre>{JSON.stringify(filteredData, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div className="App">
      <h1>BFHL Data Processor</h1>
      <textarea
        value={input}
        onChange={handleInputChange}
        placeholder='Enter JSON here'
        rows={10}
        cols={50}
      />
      <button onClick={handleSubmit}>Submit</button>
      
      <div>
        <h2>Select Options to Display:</h2>
        <label>
          <input
            type="checkbox"
            name="numbers"
            checked={selectedOptions.numbers}
            onChange={handleSelectChange}
          />
          Numbers
        </label>
        <label>
          <input
            type="checkbox"
            name="alphabets"
            checked={selectedOptions.alphabets}
            onChange={handleSelectChange}
          />
          Alphabets
        </label>
        <label>
          <input
            type="checkbox"
            name="highestAlphabet"
            checked={selectedOptions.highestAlphabet}
            onChange={handleSelectChange}
          />
          Highest Alphabet
        </label>
      </div>

      {error && <div style={{ color: 'red' }}>{error}</div>}
      {renderResponse()}
    </div>
  );
}

export default App;
