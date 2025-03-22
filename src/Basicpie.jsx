import React, { useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart'; // Correct import
import './styles.css';

function BasicPie() {
    //basic sample json data for the  states and cities and regions
    const Jsondata = {
     

        Telangana: {
            Hyderabad: ["", "SR Nagar", "Ameerpet", "Rajeev Nagar", "Hafeezpet",'Rajeev Nagr','gachibowli'],
            MahaboobNagar: ["Mahaboobnagar", "Addakal", "Balanagar"]
        },
        AndhraPradesh: {
            Vizag: ["Dondaparthy", "Maddilapalem", "Gajuwaka", "Vizag"],
            Guntur: ["Guntur", "Tenali", "Bapatla",'besant road']
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


    // get data when click on search button
    
    
    const handleSearch = async () => {
        if (selectedState == '') {
            alert("please select state")
            return;
        }
        if (selectedCity == '') {
            alert("please select city")
            return;
        }
        if (selectedRegion == '') {
            alert("please select region")
            return;
        }
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
            const response = await fetch(`http://183.82.98.147:11015/get_pollutiondata/?${queryParams.toString()}`, {
                method: 'GET',
            });

            if (response.ok) {
                const air_pollution_data = await response.json();
                console.log(air_pollution_data.length)
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


    //piechart data from the api response for allregions
    const pieChartData = apiResponse && Array.isArray(apiResponse)
        ? apiResponse.reduce((acc, apidata) => {
            // Check if aggr_param is "Region"
            if (apidata.aggr_param === "Region") {
                const existingRegion = acc.find((item) => item.id === apidata.aggr_value);

                if (existingRegion) {
                    existingRegion.sum += apidata.avg_pollutants_co2;
                    existingRegion.count += 1;
                    existingRegion.value = existingRegion.sum / existingRegion.count;
                    existingRegion.label = `${existingRegion.id}`;
                } else {
                    // Initialize the region sum and count
                    acc.push({
                        id: apidata.aggr_value || 'Unknown Region',
                        sum: apidata.avg_pollutants_co2,
                        count: 1,
                        value: apidata.avg_pollutants_co2, // Start with the first value
                        label: `${apidata.aggr_value}: ${apidata.avg_pollutants_co2.toFixed(2)}`,
                        param: apidata.aggr_param
                    });
                }
            }
            return acc;
        }, [])
        : [];




    // console.log('Aggregated pieChartData:', JSON.stringify(pieChartData, null, 2));

    // PieChart expects data in a series format, so we wrap pieChartData in series array
    const pieChartSeries = [
        {
            data: pieChartData, // The data inside the series array
        }
    ];


    const pieChartDataTS = apiResponse && Array.isArray(apiResponse)
        ? apiResponse
            .filter(apidata => apidata.state === 'Telangana' && apidata.aggr_param === 'Region') // Filter for Telangana and Region
            .reduce((acc, apidata) => {
                // Find an existing entry for the region
                const existingRegion = acc.find((item) => item.id === apidata.aggr_value);

                if (existingRegion) {
                    // Update the region's aggregated values
                    existingRegion.sum += apidata.avg_pollutants_co2;
                    existingRegion.count += 1;
                    existingRegion.value = existingRegion.sum / existingRegion.count;
                    existingRegion.label = `${existingRegion.id}`;
                } else {
                    // Initialize a new region entry
                    acc.push({
                        id: apidata.aggr_value || 'Unknown Region',
                        sum: apidata.avg_pollutants_co2,
                        count: 1,
                        value: apidata.avg_pollutants_co2, // Start with the first value
                        label: `${apidata.aggr_value}: ${apidata.avg_pollutants_co2.toFixed(2)}`,
                        param: apidata.aggr_param
                    });
                }
                return acc;
            }, [])
        : [];


    const pieChartSeriesTS = [
        {
            data: pieChartDataTS, // The aggregated data for Telangana
        }
    ];

    const pieChartDataAP = apiResponse && Array.isArray(apiResponse)
        ? apiResponse
            .filter(apidata => apidata.state === 'AndhraPradesh' && apidata.aggr_param === 'Region') // Filter for Andhra Pradesh and Region
            .reduce((acc, apidata) => {
                // Find an existing entry for the region
                const existingRegion = acc.find((item) => item.id === apidata.aggr_value);

                if (existingRegion) {
                    // Update the region's aggregated values
                    existingRegion.sum += apidata.avg_pollutants_co2;
                    existingRegion.count += 1;
                    existingRegion.value = existingRegion.sum / existingRegion.count;
                    existingRegion.label = `${existingRegion.id}`;
                } else {
                    // Initialize a new region entry
                    acc.push({
                        id: apidata.aggr_value || 'Unknown Region',
                        sum: apidata.avg_pollutants_co2,
                        count: 1,
                        value: apidata.avg_pollutants_co2, // Start with the first value
                        label: `${apidata.aggr_value}: ${apidata.avg_pollutants_co2.toFixed(2)}`,
                        param: apidata.aggr_param
                    });
                }
                return acc;
            }, [])
        : [];


    const pieChartSeriesAP = [
        {
            data: pieChartDataAP,
        }
    ];


    const states = ['AllStates', ...Object.keys(Jsondata)];
    let cities = [];
    let regions = [];

    if (selectedState === 'AllStates') {
        // Default to "AllCities" and "AllRegions"
        cities = ['AllCities'];
        regions = ['AllRegions'];
    } else if (selectedState) {
        // Populate cities and include "AllCities" as an option
        cities = ['AllCities', ...Object.keys(Jsondata[selectedState])];

        if (selectedCity === 'AllCities') {
            // Populate allregions if "AllCities" is selected
            regions = ['AllRegions', ...Object.values(Jsondata[selectedState]).flat()];
        } else if (selectedCity) {
            // Populate regions specific to the selected city
            regions = Jsondata[selectedState][selectedCity];
        }
    }

    // Handle state change
    const handleStateChange = (event) => {
        setSelectedState(event.target.value);
        setSelectedCity('AllCities'); // Default to "AllCities"
        setSelectedRegion('AllRegions'); // Default to "AllRegions"
    };

    // Handle city change
    const handleCityChange = (event) => {
        setSelectedCity(event.target.value);
        setSelectedRegion('AllRegions'); // Default to "AllRegions"
    };

    // Handle region change
    const handleRegionChange = (event) => {
        setSelectedRegion(event.target.value);
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
                        disabled={selectedState === 'AllStates'} // Disable when "AllStates" is selected
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
                        disabled={
                            selectedState === 'AllStates' || selectedCity === 'AllCities'
                        } // Disable based on conditions
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
                <div className="pie-chart-container">
                    <div className="pie-chart-item">
                        <h3>Pollutants by Region</h3>
                        <PieChart
                            series={pieChartSeries}
                            width={400}
                            height={400}
                            label={({ dataEntry }) => `${dataEntry.label}: ${dataEntry.value.toFixed(2)}`}
                        />
                    </div>

                    <div className="pie-chart-item">
                        <h3>Pollutants in Andhra Pradesh</h3>
                        <PieChart
                            series={pieChartSeriesAP}
                            width={400}
                            height={400}
                            label={({ dataEntry }) => `${dataEntry.label}: ${dataEntry.value.toFixed(2)}`}
                        />
                    </div>

                    <div className="pie-chart-item">
                        <h3>Pollutants in Telangana</h3>
                        <PieChart
                            series={pieChartSeriesTS}
                            width={400}
                            height={400}
                            label={({ dataEntry }) => `${dataEntry.label}: ${dataEntry.value.toFixed(2)}`}
                        />
                    </div>
                </div>
            )}


            {showTable && apiResponse.length > 0 && (
                <div className='overflows'>
                    <table style={{ width: "100%" }} className="table employee-table">
                        <thead>
                            <tr>
                                {/* <th>State</th>
                                <th>City</th>
                                <th>Region</th> */}
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
                                    {/* <td>{selectedState}</td>
                                    <td>{selectedCity}</td>
                                    <td>{selectedRegion}</td> */}
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

        </div>
    );
}

export default BasicPie;
