import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { FaHome, FaChartLine, FaArrowUp, FaArrowCircleUp } from 'react-icons/fa';
import './Dashboard.css';

const numberWithCommas = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const columns = [
  {
    field: 'base_currency',
    headerName: 'BASE CURRENCY',
    width: 150,
    editable: true,
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

const Dashboard = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredKey, setFilteredKey] = useState("top-volume");

  useEffect(() => {
    fetchData();
  }, [filteredKey]);

  const fetchData = async () => {
    try {
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
          volume_h24: item.volume.h24,
          percent_change: calculatePercentageChange(item),
        }));

        // Filter out rows with non-positive percent_change for 'top-gainer' filter
        let filteredRows = [...newData];
        if (filteredKey === 'top-gainer') {
          filteredRows = newData.filter(item => item.percent_change > 0);
        }

        // Sort data based on filter key
        if (filteredKey === 'top-gainer') {
          filteredRows.sort((a, b) => b.percent_change - a.percent_change); // Sort descending by percentage change
        } else if (filteredKey === 'top-volume') {
          filteredRows.sort((a, b) => b.base_volume - a.base_volume); // Sort descending by base volume
        } else if (filteredKey === 'trending') {
          filteredRows.sort((a, b) => b.volume_h24 - a.volume_h24); // Sort descending by 24h trading volume
        } else if (filteredKey === 'ath-discovery') {
          filteredRows.sort((a, b) => b.high - a.high); // Sort descending by highest price
        }

        setRows(filteredRows);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentageChange = (item) => {
    const lastPrice = parseFloat(item.last_price);
    const highPrice = parseFloat(item.high);
    if (highPrice !== 0) {
      return (( lastPrice - highPrice) / highPrice) * 100;
    }
    return 0; // Handle division by zero or other edge cases
  };

  const handleFilter = (event, newFilter) => {
    setFilteredKey(newFilter);
  };

  if (loading) {
    return (
      <div className="buffering-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Navbar */}
      <Navbar />

      {/* Content Container */}
      <Box sx={{ display: 'flex', width: '100%' }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <Box className="main-content" sx={{ p: 3, flexGrow: 1 }}>
          {/* Filter Toggle Buttons */}
          <Box sx={{ mb: 2 }}>
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
          </Box>

          {/* DataGrid */}
          <div style={{ height: 520 }}>
            <DataGrid disableColumnSorting
              className='table-data'
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
            />
          </div>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
