import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { FaHome, FaChartLine, FaArrowUp, FaArrowCircleUp, FaSearch } from 'react-icons/fa';
import './Dashboard.css';

const numberWithCommas = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const Dashboard = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredKey, setFilteredKey] = useState("top-volume");
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastRefreshTime, setLastRefreshTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState("0s");
  const [counterVisible, setCounterVisible] = useState(false);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 10000); // Refresh data every 10 seconds
    const timerId = setInterval(updateElapsedTime, 1000); // Update elapsed time every second

    return () => {
      clearInterval(intervalId); // Clear the data fetch interval on component unmount
      clearInterval(timerId); // Clear the elapsed time timer on component unmount
    };
  }, []);

  useEffect(() => {
    filterAndSortData();
  }, [rows, filteredKey, searchQuery]);

  const fetchData = async () => {
    try {
      setCounterVisible(true); // Show counter while loading data
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:5000/top_coins_alldata', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (response.data) {
        const newData = response.data.map((item, index) => ({
          id: index + 1,
          base_currency: item.base_currency,
          base_volume: item.base_volume,
          last_price: item.last_price,
          high: item.high,
          liquidity: item.liquidity,
          low: item.low,
          volume_h24: item.volume && item.volume.h24 ? item.volume.h24 : 0,
          percent_change: calculatePercentageChange(item),
          base_address: item.base_address // Add base_address here
        }));

        setRows(newData);
        setLoading(false);
        setLastRefreshTime(new Date()); // Update the last refresh time
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    } finally {
      setCounterVisible(false); // Hide counter once loading is done
    }
  };

  const filterAndSortData = () => {
    let filteredData = [...rows];

    if (searchQuery.trim() !== "") {
      filteredData = filteredData.filter(row =>
        row.base_currency.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    }

    if (filteredKey === 'top-gainer') {
      filteredData = filteredData.filter(item => item.percent_change > 0);
      filteredData.sort((a, b) => b.percent_change - a.percent_change);
    } else if (filteredKey === 'top-volume') {
      filteredData.sort((a, b) => b.base_volume - a.base_volume);
    } else if (filteredKey === 'trending') {
      filteredData.sort((a, b) => b.volume_h24 - a.volume_h24);
    } else if (filteredKey === 'ath-discovery') {
      filteredData.sort((a, b) => b.high - a.high);
    }

    setFilteredRows(filteredData);
  };

  const calculatePercentageChange = (item) => {
    const lastPrice = parseFloat(item.last_price);
    const highPrice = parseFloat(item.high);
    if (highPrice !== 0) {
      return ((lastPrice - highPrice) / highPrice) * 100;
    }
    return 0;
  };

  const handleFilter = (event, newFilter) => {
    setFilteredKey(newFilter);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const updateElapsedTime = () => {
    if (lastRefreshTime) {
      const now = new Date();
      const diffInSeconds = Math.floor((now - lastRefreshTime) / 1000);
      setElapsedTime(`${diffInSeconds}s`);
    }
  };

  const columns = [
    {
      field: 'base_currency',
      headerName: 'BASE CURRENCY',
      width: 150,
      editable: true,
      renderCell: (params) => (
        <Link to={`/currency-detail/${params.row.base_address}`} style={{ textDecoration: 'none', color: 'white' }}>
          {params.value}
        </Link>
      ),
    },
    {
      field: 'base_volume',
      headerName: 'BASE VOLUME',
      width: 200,
      editable: true,
      renderCell: (params) => `$${numberWithCommas(parseFloat(params.value).toFixed(0))}`,
    },
    {
      field: 'volume_h24',
      headerName: 'VOLUME (24H)',
      width: 150,
      editable: true,
      renderCell: (params) => `$${numberWithCommas(parseFloat(params.value).toFixed(2))}`,
    },
    {
      field: 'high',
      headerName: 'HIGH',
      width: 150,
      editable: true,
      renderCell: (params) => `$${numberWithCommas(parseFloat(params.value).toFixed(5))}`,
    },
    {
      field: 'low',
      headerName: 'LOW',
      width: 150,
      editable: true,
      renderCell: (params) => `$${numberWithCommas(parseFloat(params.value).toFixed(5))}`,
    },
    {
      field: 'last_price',
      headerName: 'LAST PRICE',
      width: 150,
      editable: true,
      renderCell: (params) => `$${numberWithCommas(parseFloat(params.value).toFixed(5))}`,
    },
    {
      field: 'liquidity',
      headerName: 'LIQUIDITY',
      width: 150,
      editable: true,
      renderCell: (params) => `$${numberWithCommas(parseFloat(params.value.usd).toFixed(0))}`,
    },
    {
      field: 'percent_change',
      headerName: '% CHANGE',
      width: 150,
      editable: false,
      renderCell: (params) => {
        const value = params.value;
        const formattedValue = `${value.toFixed(2)}%`;
        const color = value >= 0 ? 'green' : 'red';
        return <span style={{ color }}>{formattedValue}</span>;
      },
    },
  ];

  if (loading || counterVisible) {
    return (
      <div className="buffering-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
        {counterVisible && <p>Refreshing in {elapsedTime}</p>} {/* Show counter while loading */}
      </div>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar onSearch={handleSearch} />
      <Box sx={{ display: 'flex', width: '100%' }}>
        <Sidebar />
        <Box className="main-content" sx={{ p: 3, flexGrow: 1 }}>
          <Box className="desktop-only" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <ToggleButtonGroup className='filter-button'
              value={filteredKey}
              exclusive
              onChange={handleFilter}
              aria-label="filter options"
            >
              <ToggleButton className='toggle-button' value="top-volume" >
                <FaArrowCircleUp className="nav-icon" />
                Top Volume
              </ToggleButton>
              <ToggleButton className='toggle-button' value="top-gainer">
                <FaHome className="nav-icon" />
                Top Gainer
              </ToggleButton>
              <ToggleButton className='toggle-button' value="trending">
                <FaChartLine className="nav-icon" />
                Trending
              </ToggleButton>
              <ToggleButton className='toggle-button' value="ath-discovery" >
                <FaArrowUp className="nav-icon" />
                ATH Discovery
              </ToggleButton>
            </ToggleButtonGroup>

            <div className="search-bar">
              <input
                type="text"
                placeholder="Search base currency..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)} />
                <FaSearch className="icon" />
            </div>
          </Box>

          <div style={{ height: 520 }}>
            <DataGrid disableColumnSorting
              className='table-data'
              rows={filteredRows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
            />
          </div>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
              '@media (max-width: 768px)': {
                flexDirection: 'column',
              }
            }}
            className="fixed-bottom-bar mobile-only"
          >
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search base currency..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <FaSearch className="icon" />
            </div>
            <ToggleButtonGroup
              className='filter-button'
              value={filteredKey}
              exclusive
              onChange={handleFilter}
              aria-label="filter options"
            >
              <ToggleButton className='toggle-button' value="top-volume">
                <FaArrowCircleUp className="nav-icon" />
                Volume
              </ToggleButton>
              <ToggleButton className='toggle-button' value="top-gainer">
                <FaHome className="nav-icon" />
                Gainer
              </ToggleButton>
              <ToggleButton className='toggle-button' value="trending">
                <FaChartLine className="nav-icon" />
                Trending
              </ToggleButton>
              <ToggleButton className='toggle-button' value="ath-discovery">
                <FaArrowUp className="nav-icon" />
                ATH Discovery
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Box sx={{ mt: 2 }}>
            <p>Last refresh: {elapsedTime}</p>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
