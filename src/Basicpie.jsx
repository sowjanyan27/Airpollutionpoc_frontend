import React, { useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart'; // Correct import
import './styles.css';

function BasicPie() {
    //basic sample json data for the  states and cities and regions
    const data = {
        Telangana: {
            Hyderabad: ["SR Nagar", "Ameerpet", "Rajeev Nagar", "Hafeezpet"],
            MahaboobNagar: ["Mahaboobnagar", "Addakal", "Balanagar"]
        },
        AndhraPradesh: {
            Vizag: ["Dondaparthy", "Maddilapalem", "Gajuwaka", "Vizag"],
            Guntur: ["Guntur", "Tenali", "Bapatla"]
        }
    };

    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [showTable, setShowTable] = useState(false);
    const [timeUnit, setTimeUnit] = useState('hour');
    const [timeValue, setTimeValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [apiResponse, setApiResponse] = useState([]);

    const handleStateChange = (e) => {
        const state = e.target.value;
        setSelectedState(state);
        setSelectedCity(''); // Reset city selection
        setSelectedRegion(''); // Reset region selection
        setShowTable(false);
    };

    const handleCityChange = (e) => {
        const city = e.target.value;
        setSelectedCity(city);
        setSelectedRegion(''); // Reset region selection
        setShowTable(false);
    };

    const handleRegionChange = (e) => {
        setSelectedRegion(e.target.value);
        setShowTable(false);
    };

    // get data when click on search button
   
    const handleSearch = async () => {
        setShowTable(true);
        setLoading(true);

        //query params for the GET request
        const queryParams = new URLSearchParams({
            state: selectedState,
            city: selectedCity,
            region: selectedRegion,
            time_interval: timeUnit === 'hour' ? `${timeValue} hour` : `${timeValue} days`,
        });

        try {
            const response = await fetch(`http://127.0.0.1:8000/get_pollutiondata/?${queryParams.toString()}`, {
                method: 'GET', 
            });

            if (response.ok) {
                const air_pollution_data = await response.json();
                console.log('API Response:', air_pollution_data);  
                setApiResponse(air_pollution_data); 
            } else {
                setApiResponse([]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setApiResponse([]);
        }
        setLoading(false);
    };

    const states = ['All States', ...Object.keys(data)];

    let cities = [];
    let regions = [];

    if (selectedState === 'All States') {
        cities = ['All Cities', ...Object.values(data).flatMap(stateCities => Object.keys(stateCities))];

        if (selectedCity === 'All Cities') {
            regions = ['All Regions', ...Object.values(data).flatMap(stateCities => Object.values(stateCities)).flat()];
        } else if (selectedCity) {
            regions = Object.values(data).flatMap(stateCities => Object.entries(stateCities)
                .filter(([city, _]) => city === selectedCity)
                .map(([_, cityRegions]) => cityRegions)
            ).flat();
        }
    } else if (selectedState) {
        cities = Object.keys(data[selectedState]);
        regions = selectedCity ? data[selectedState][selectedCity] : [];
    }
//piechart data from the api response
    const pieChartData = apiResponse && Array.isArray(apiResponse)
        ? apiResponse.reduce((acc, apidata) => {
            const existingRegion = acc.find((item) => item.id === apidata.aggr_value);
            if (existingRegion) {
                existingRegion.value += apidata.avg_pollutants_co2; // Sum of pollutants
                existingRegion.label = `${existingRegion.id}: ${existingRegion.value.toFixed(2)}`;
            } else {
                acc.push({
                    id: apidata.aggr_value || 'Unknown Region',
                    value: apidata.avg_pollutants_co2,
                    label: `${apidata.aggr_value}: ${apidata.avg_pollutants_co2.toFixed(2)}`,
                });
            }
            return acc;
        }, [])
        : [];

    console.log('Aggregated pieChartData:', JSON.stringify(pieChartData, null, 2));

    // PieChart expects data in a series format, so we wrap pieChartData in series array
    const pieChartSeries = [
        {
            data: pieChartData, // The data inside the series array
        }
    ];

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
                    <label>Duration</label>
                    <div>
                        <label>
                            <input
                                type="radio"
                                name="timeUnit"
                                value="hour"
                                checked={timeUnit === 'hour'}
                                onChange={(e) => setTimeUnit(e.target.value)}
                            />
                            Hour
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="timeUnit"
                                value="day"
                                checked={timeUnit === 'day'}
                                onChange={(e) => setTimeUnit(e.target.value)}
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
                        placeholder={`Enter ${timeUnit === 'hour' ? '1-24 hours' : '1 or more days'}`}
                    />
                </div>

                <button className="search-btn" onClick={handleSearch}>Search</button>
            </div>

            {showTable && apiResponse.length > 0 && (
                <div className='overflows'>
                    <table style={{ width: "100%" }} className="table employee-table">
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

            {/* Render PieChart */}
            {showTable && apiResponse.length > 0 && (
                <div className="pie-chart-container">
                    <h3>Pollutants by Region</h3>
                    <PieChart
                        series={pieChartSeries} 
                        width={400}
                        height={400}
                        data={({ dataEntry }) => `${dataEntry.label}: ${dataEntry.value.toFixed(2)}`}
                    />
                </div>
            )}
        </div>
    );
}

export default BasicPie;
