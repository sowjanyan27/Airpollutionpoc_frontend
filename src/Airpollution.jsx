


import React, { useState } from 'react';
import './App.css';

function Airpollution() {
  const data = {
    Telangana: {
      Hyderabad: ["SR Nagar", "Ameerpet", "Rajeev Nagar", "Hafeezpet"],
      MahaboobNagar: ["Mahaboobnagar", "Addakal", "Balanagar"]
    },
    "Andhra Pradesh": {
      Vizag: ["Dondaparthy", "Maddilapalem", "Gajuwaka"],
      Guntur: ["Guntur", "Tenali", "Bapatla"]
    }
  };

  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [showTable, setShowTable] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle state change
  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setSelectedCity('');
    setSelectedRegion('');
    setShowTable(false); // Hide table when state changes
  };

  // Handle city change
  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    setSelectedRegion('');
    setShowTable(false); // Hide table when city changes
  };

  // Handle region change
  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
    setShowTable(false); // Hide table when region changes
  };

  // Handle search button click and API call
  const handleSearch = async () => {
    setShowTable(true);
  
    // Show loading state
    setLoading(true);
  
    // Prepare query parameters to send to the API
    // const queryParams = new URLSearchParams({
    //   state: selectedState,
    //   city: selectedCity,
    //   region: selectedRegion,
    // });
  
    try {
      // Example of sending data via a GET request with query parameters
      const response = await fetch(`http://127.0.0.1:8000/get_pollutiondata/?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setApiResponse(data); // Store API response
      } else {
        console.error('Error:', response.status);
        setApiResponse(null);
      }
    } catch (error) {
      console.error('Error during API call:', error);
      setApiResponse(null);
    }
  
    setLoading(false); // Hide loading spinner after API call
  };
  

  // Generate the list of states, cities, and regions based on the selection
  const states = Object.keys(data);
  const cities = selectedState ? Object.keys(data[selectedState]) : [];
  const regions = selectedCity ? data[selectedState][selectedCity] : [];

  // Format the date
  const getFormattedDate = () => {
    const date = new Date();
    return date.toLocaleDateString(); // Adjust format as needed
  };

  return (
    <div>
      <div>
        <label htmlFor="state">State:</label>
        <select id="state" value={selectedState} onChange={handleStateChange}>
          <option value="">Select State</option>
          {states.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="city">City:</label>
        <select
          id="city"
          value={selectedCity}
          onChange={handleCityChange}
          disabled={!selectedState}
        >
          <option value="">Select City</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="region">Region:</label>
        <select
          id="region"
          value={selectedRegion}
          onChange={handleRegionChange}
          disabled={!selectedCity}
        >
          <option value="">Select Region</option>
          {regions.map(region => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>
      </div>

      <div>
        <button onClick={handleSearch} disabled={loading}>Search</button>
      </div>

      {/* Show loading spinner */}
      {loading && <p>Loading...</p>}

      {/* Display table after clicking search */}
      {showTable && (
        <div>
          <h3>Selected Information</h3>
          <table>
            <thead>
              <tr>
                <th>State</th>
                <th>City</th>
                <th>Region</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{selectedState}</td>
                <td>{selectedCity}</td>
                <td>{selectedRegion}</td>
                <td>{getFormattedDate()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Show API response (if any) */}
      {apiResponse && (
        <div>
          <h3>API Response</h3>
          <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default Airpollution;
