import React, { useState } from 'react';
import './styles.css';

const AirPollutionpoc = () => {
  // State for dropdowns, table filtering, and radio selection
  const data = {
    Telangana: {
      Hyderabad: ["SR Nagar", "Ameerpet", "Rajeev Nagar", "Hafeezpet"],
      MahaboobNagar: ["Mahaboobnagar", "Addakal", "Balanagar"]
    },
    AndhraPradesh: {
      Vizag: ["Dondaparthy", "Maddilapalem", "Gajuwaka","Vizag"],
      Guntur: ["Guntur", "Tenali", "Bapatla"]
    }
  };

  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [showTable, setShowTable] = useState(false);
  const [timeUnit, setTimeUnit] = useState('day'); // 'hour' or 'day'
  const [timeValue, setTimeValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setSelectedCity('');
    setSelectedRegion('');
    setShowTable(false);
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    setSelectedRegion('');
    setShowTable(false);
  };

  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
    setShowTable(false);
  };

  const handleSearch1 = () => {
    if (timeValue < 1) {
      alert('Please enter a valid number (greater than 0)');
      return;
    }
    setShowTable(true);
  };

  const handleSearch = async () => {
    setShowTable(true);
    setLoading(true);
  
    // Prepare the data object to send in the request body
    const requestData = {
      state: selectedState,
      city: selectedCity,
      region: selectedRegion,
      time_interval: timeUnit === 'hour' ? `${timeValue} hour` : `${timeValue} days`, // Send 'hours' or 'days' based on selection
      // duration_type: timeUnit === 'hour' ? 'hour' : 'days', // Set 'hour' or 'days' based on the radio button
    };
  
    console.log(requestData, 'requestData'); // Log the data object for debugging
  
    try {
      // Send the data in the request body as JSON
      const response = await fetch(`http://127.0.0.1:8000/get_pollutiondata/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Inform the server that we're sending JSON data
        },
        body: JSON.stringify(requestData), // Send the request data as a JSON string
      });
  
      if (response.ok) {
        const air_pollution_data = await response.json();
        console.log(air_pollution_data, 'air_pollution_data');
        setApiResponse(air_pollution_data); // Store API response
        console.log(apiResponse)
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
  
  
  const handleTimeUnitChange = (e) => {
    setTimeUnit(e.target.value);
    setTimeValue(''); // Reset the time input when switching
  };

  const states = ['All States', ...Object.keys(data)];
  
  let cities = [];
  let regions = [];

  if (selectedState === 'All States') {
    // When 'All States' is selected, show the label 'All Cities' and 'All Regions'
    cities = ['All Cities'];
    regions = ['All Regions'];
  } else if (selectedState) {
    // When a specific state is selected, show cities and regions for that state
    cities = Object.keys(data[selectedState]);
    regions = selectedCity ? data[selectedState][selectedCity] : [];
  }

  const getFormattedDate = () => {
    const date = new Date();
    return date.toLocaleDateString(); // Adjust format as needed
  };

  return (
    <div className="employee-container">
      <h2 className="heading">Air Pollution Poc</h2>

      <div className="filters">
        <div className="filter-item">
          <label htmlFor="state">State</label>
          <select id="state" value={selectedState} onChange={handleStateChange}>
            <option value="">Select State</option>
            {states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label htmlFor="city">City</label>
          <select
            id="city"
            value={selectedCity}
            onChange={handleCityChange}
            disabled={selectedState === ''}
          >
            <option value="">Select City</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label htmlFor="region">Region</label>
          <select
            id="region"
            value={selectedRegion}
            onChange={handleRegionChange}
            disabled={selectedCity === ''}
          >
            <option value="">Select Region</option>
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label>Time Unit</label>
          <div>
            <label>
              <input
                type="radio"
                name="timeUnit"
                value="hour"
                checked={timeUnit === 'hour'}
                onChange={handleTimeUnitChange}
              />
              Hour
            </label>
            <label>
              <input
                type="radio"
                name="timeUnit"
                value="day"
                checked={timeUnit === 'day'}
                onChange={handleTimeUnitChange}
              />
              Day
            </label>
          </div>
        </div>

        <div className="filter-item">
          <label htmlFor="timeValue">Enter {timeUnit === 'hour' ? 'Hours' : 'Days'}</label>
          <input
            type="text"
            id="timeValue"
            value={timeValue}
            onChange={(e) => setTimeValue(e.target.value)}
            min="1"
            placeholder={`Enter ${timeUnit === 'hour' ? '1-24 hours' : '1 or more days'}`}
          />
        </div>
        <button className="search-btn" onClick={handleSearch}>Search</button>
      </div>

      {/* {loading && <p>Loading...</p>} */}
     {showTable && apiResponse && apiResponse.length > 0 && (
      <div className='overflows'>
  <table style={{width:"100%"}} className="table employee-table">
    <thead>
      <tr>
        <th>State</th>
        <th>City</th>
        <th>Region</th>
        <th>count_co2</th>
        <th>avg_co2</th>
        <th>sum_co2</th>
        <th>aggr_param</th>
        <th>aggr_value</th>
        <th>Start Date</th>
        <th>End Date</th>
      </tr>
    </thead>
    <tbody>
      {apiResponse.map((apidata, index) => (
        <tr key={index}>
          <td>{selectedState}</td>
          <td>{selectedCity}</td>
          <td>{selectedRegion}</td>
          <td>{apidata.count_pollutants_co2}</td>
          <td>{apidata.avg_pollutants_co2.toFixed(2)}</td>
          <td>{apidata.sum_pollutants_co2}</td>
          <td>{apidata.aggr_param}</td>
          <td>{apidata.aggr_value}</td>
          <td>{apidata.start}</td>
          <td>{apidata.end}</td>
        </tr>
      ))}
    </tbody>
  </table>
  </div>
)}

    </div>
  );
};

export default AirPollutionpoc;
