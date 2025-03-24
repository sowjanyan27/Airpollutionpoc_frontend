import React, { useState, useEffect } from 'react';
import { PieChart } from '@mui/x-charts/PieChart'; // Correct import
import './styles.css';
import Spinner from "react-bootstrap/Spinner";
import { toast } from "react-toastify";
import { useTheme } from "@mui/material/styles";
import "react-toastify/dist/ReactToastify.css";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";

function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === "rtl" ? (
                    <KeyboardArrowRight />
                ) : (
                    <KeyboardArrowLeft />
                )}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === "rtl" ? (
                    <KeyboardArrowLeft />
                ) : (
                    <KeyboardArrowRight />
                )}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}
function BasicPie() {
    //basic sample json data for the  states and cities and regions
    const Jsondata = {


        Telangana: {
            Hyderabad: ["", "SR Nagar", "Ameerpet", "Rajeev Nagar", "Hafeezpet", 'Rajeev Nagr', 'gachibowli'],
            MahaboobNagar: ["Mahaboobnagar", "Addakal", "Balanagar"]
        },
        AndhraPradesh: {
            Vizag: ["Dondaparthy", "Maddilapalem", "Gajuwaka", "Vizag"],
            Guntur: ["Guntur", "Tenali", "Bapatla", 'besant road']
        }
    };

    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [regions, setRegions] = useState([]);
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [showTable, setShowTable] = useState(false);
    const [timeUnit, setTimeUnit] = useState('hour');
    const [timeValue, setTimeValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [apiResponse, setApiResponse] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    
    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to page 0 when rows per page changes
    };
    
    const displayedData = apiResponse.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    
    useEffect(() => {
        const fetchStates = async () => {
            try {
                const response = await fetch('http://183.82.98.147:11015/get_states/', {
                    method: 'GET',
                });
                const data = await response.json();
                setStates([{ state_name: 'AllStates' }, ...data]); // Add "AllStates" as the default
            } catch (error) {
                console.error('Error fetching states:', error);
            }
        };
        fetchStates();
    }, []);

    // Fetch cities dynamically based on the selected state
    const fetchCities = async (stateName) => {
        try {
            const response = await fetch(`http://183.82.98.147:11015/get_cities/?state=${stateName}`, {
                method: 'GET',
            });
            const data = await response.json();
            setCities([{ city_name: 'AllCities' }, ...data]); // Add "AllCities" as the default
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    // Fetch regions dynamically based on the selected city
    const fetchRegions = async (cityName) => {
        try {
            const response = await fetch(`http://183.82.98.147:11015/get_regions/?city=${cityName}`, {
                method: 'GET',
            });
            const data = await response.json();
            setRegions([{ region_name: 'AllRegions' }, ...data]); // Add "AllRegions" as the default
        } catch (error) {
            console.error('Error fetching regions:', error);
        }
    };

    // Handle state change
    const handleStateChange = async (event) => {
        const stateName = event.target.value;
        setSelectedState(stateName);
        setSelectedCity('AllCities'); // Reset city dropdown to default
        setSelectedRegion('AllRegions'); // Reset region dropdown to default

        if (stateName === 'AllStates') {
            setCities([{ city_name: 'AllCities' }]); // Default to "AllCities"
            setRegions([{ region_name: 'AllRegions' }]); // Default to "AllRegions"
        } else {
            await fetchCities(stateName); // Fetch cities for the selected state
            setRegions([{ region_name: 'AllRegions' }]); // Default to "AllRegions"
        }
    };

    // Handle city change
    const handleCityChange = async (event) => {
        const cityName = event.target.value;
        setSelectedCity(cityName);
        setSelectedRegion('AllRegions'); // Reset region dropdown to default

        if (cityName === 'AllCities') {
            setRegions([{ region_name: 'AllRegions' }]); // Default to "AllRegions"
        } else {
            await fetchRegions(cityName); // Fetch regions for the selected city
        }
    };

    // Handle region change
    const handleRegionChange = (event) => {
        setSelectedRegion(event.target.value); // Update selected region
    };

    const handleSearch = async () => {
        if (selectedState == '') {
            toast.warn("please select state")
            return;

        }
        if (selectedCity == '') {
            toast.warn("please select City")
            return;

        }
        if (selectedRegion == '') {
            toast.warn("please select state")
            return;

        }
        if (timeUnit === '' && timeValue === '') {
            toast.warn('Please select a time unit (hour or day) or enter a valid time value');
            return;
        }

        // If time unit is selected, ensure time value is provided
        if (timeUnit !== '' && timeValue === '') {
            toast.warn(`Please enter a valid number for ${timeUnit === 'hour' ? 'hours' : 'days'}`);
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







    return (
        <div className="employee-container">
            <h2 className="heading">Air Pollution Poc</h2>

            <div className="filters">

                <div className="filter-item">
                    <label htmlFor="state">State</label>
                    <select id="state" value={selectedState} onChange={handleStateChange}>
                        <option value="">Select State</option>
                        {states.map(state => (
                            <option key={state.state_name} value={state.state_name}>
                                {state.state_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* City Dropdown */}
                <div className="filter-item">
                    <label htmlFor="city">City</label>
                    <select
                        id="city"
                        value={selectedCity}
                        onChange={handleCityChange}
                        disabled={selectedState === 'AllStates'} // Disable if "AllStates" is selected
                    >
                        <option value="">Select City</option>
                        {cities.map(city => (
                            <option key={city.city_name} value={city.city_name}>
                                {city.city_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Region Dropdown */}
                <div className="filter-item">
                    <label htmlFor="region">Region</label>
                    <select
                        id="region"
                        value={selectedRegion}
                        onChange={handleRegionChange}
                        disabled={
                            selectedState === 'AllStates' || selectedCity === 'AllCities'
                        } // Disable if "AllStates" or "AllCities" is selected
                    >
                        <option value="">Select Region</option>
                        {regions.map(region => (
                            <option key={region.region_name} value={region.region_name}>
                                {region.region_name}
                            </option>
                        ))}
                    </select>
                </div>



                <div className="filter-item">
                    <label>Duration</label>
                    <div >
                        <label style={{padding:'10%'}}>
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
                {/* {loading && (
                <div className="loader"></div>
            )} */}

                <button className="search-btn" onClick={handleSearch}>Search</button>
            </div>


            <div>
    {loading === true ? (
        <div className="text-center w-100 loader-overlay">
            <div className="spinner">
                <Spinner animation="border" variant="primary" />
            </div>
        </div>
    ) : (
        showTable && apiResponse.length > 0 && (
            <>
                {/* Pie charts container */}
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

                {/* Table Container */}
                <div className="overflows">
                    <TableContainer component={Paper} elevation={4}>
                        <Table aria-label="simple table" className="table employee-table">
                            <TableHead >
                                <TableRow >
                                    <TableCell width="10%" style={{ fontWeight: 'bold' }}>Count CO2</TableCell>
                                    <TableCell width="10%" style={{ fontWeight: 'bold' }}>Avg CO2</TableCell>
                                    <TableCell width="10%" style={{ fontWeight: 'bold' }}>Sum CO2</TableCell>
                                    <TableCell width="10%" style={{ fontWeight: 'bold' }}>Aggr Param</TableCell>
                                    <TableCell width="20%" style={{ fontWeight: 'bold' }}>Aggr Value</TableCell>
                                    <TableCell width="20%" style={{ fontWeight: 'bold' }}>Start Date</TableCell>
                                    <TableCell width="20%" style={{ fontWeight: 'bold' }}>End Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {displayedData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan="7">
                                            <div className="nodata-found-con">
                                                <div className="nodata text-center w-100">
                                                    No Records Found
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    displayedData.map((apidata, index) => (
                                        <TableRow key={`row-${index}`}>
                                            <TableCell>{apidata.count_pollutants_co2}</TableCell>
                                            <TableCell>{apidata.avg_pollutants_co2.toFixed(2)}</TableCell>
                                            <TableCell>{apidata.sum_pollutants_co2}</TableCell>
                                            <TableCell>{apidata.aggr_param}</TableCell>
                                            <TableCell>{apidata.aggr_value}</TableCell>
                                            <TableCell>{apidata.start}</TableCell>
                                            <TableCell>{apidata.end}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[10, 20, 30, { label: "All", value: -1 }]}
                                        count={apiResponse.length} // Total data length for pagination
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handlePageChange}
                                        onRowsPerPageChange={handleRowsPerPageChange}
                                        ActionsComponent={TablePaginationActions}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </div>
            </>
        )
    )}
</div>


          

        </div>
    );
}

export default BasicPie;
