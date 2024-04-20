import React, { useState } from 'react';
import axios from 'axios';
import './PincodeLookup.css';

const PincodeLookup = () => {
  const [pincode, setPincode] = useState('');
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterValue, setFilterValue] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
      if (response.data && response.data.length > 0 && response.data[0].Status === 'Success') {
        setData(response.data[0].PostOffice);
        setFilteredData(response.data[0].PostOffice);
        setError('');
      } else {
        setError('Error: Unable to fetch data');
      }
    } catch (error) {
      setError('Error: Unable to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handlePincodeChange = (event) => {
    const { value } = event.target;
    if (/^\d{0,6}$/.test(value)) {
      setPincode(value);
    }
  };

  const handleFilterChange = (event) => {
    const { value } = event.target;
    if (value) {
      const filtered = data.filter((item) => item.Name.toLowerCase().includes(value.toLowerCase()));
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
    setFilterValue(value);
  };

  return (
    <div className="pincode-lookup-container">
      <div className="pincode-lookup">
        <div className="form-group">
          <label htmlFor="pincode">Enter Pincode:</label>
          <input
            type="text"
            id="pincode"
            value={pincode}
            onChange={handlePincodeChange}
            maxLength={6}
            placeholder="Enter 6-digit Pincode"
          />
          <button className="lookup-button" onClick={fetchData} disabled={pincode.length !== 6 || loading}>
            Lookup
          </button>
        </div>
        {loading && <div className="loader">Loading...</div>}
        {error && <div className="error">{error}</div>}
        <div className="result">
          {filteredData.length === 0 && !loading && <div className="no-data">No data found...</div>}
          {filteredData.map((item, index) => (
            <div key={index} className="result-item">
              <p><strong>Post Office:</strong> {item.Name}</p>
              <p><strong>Branch Type:</strong> {item.BranchType}</p>
              <p><strong>District:</strong> {item.District}</p>
              <p><strong>State:</strong> {item.State}</p>
              <hr />
            </div>
          ))}
        </div>
        <div className="filter">
          <input
            type="text"
            placeholder="Filter by Post Office Name"
            value={filterValue}
            onChange={handleFilterChange}
          />
        </div>//////////////
      </div>
    </div>
  );
};

export default PincodeLookup;

