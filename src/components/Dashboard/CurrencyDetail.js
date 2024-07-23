import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import { DataGrid } from '@mui/x-data-grid';
import './CurrencyDetail.css';

const CurrencyDetail = () => {
  const { base_address } = useParams(); // Get base_address from the URL
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [base_address]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/holder_dex_data/${base_address}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      //console.log('API Response:', response.data); // Log the API response for debugging
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="buffering-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Ensure data and its nested properties are defined before rendering
  const dexData = data?.dex_data || {};
  const baseToken = dexData.baseToken || {};
  const liquidity = dexData.liquidity || {};
  const priceChange = dexData.priceChange || {};

  // Define columns for the Dex Data table
  const dexColumns = [
    { field: 'key', headerName: 'Key', width: 250 },
    { field: 'value', headerName: 'Value', width: 400 },
  ];

  // Format dexData for the table
  const dexRows = [
    { id: 1, key: 'Base Token Address', value: baseToken.address || 'N/A' },
    { id: 2, key: 'Base Token Name', value: baseToken.name || 'N/A' },
    { id: 3, key: 'Base Token Symbol', value: baseToken.symbol || 'N/A' },
    { id: 4, key: 'FDV', value: dexData.fdv || 'N/A' },
    { id: 5, key: 'Liquidity (Base)', value: liquidity.base || 'N/A' },
    { id: 6, key: 'Liquidity (Quote)', value: liquidity.quote || 'N/A' },
    { id: 7, key: 'Liquidity (USD)', value: liquidity.usd || 'N/A' },
    { id: 8, key: 'Price Change (1h)', value: priceChange.h1 || 'N/A' },
    { id: 9, key: 'Price Change (24h)', value: priceChange.h24 || 'N/A' },
    { id: 10, key: 'Price Change (6h)', value: priceChange.h6 || 'N/A' },
    { id: 11, key: 'Price Change (5m)', value: priceChange.m5 || 'N/A' },
    { id: 12, key: 'Price USD', value: dexData.priceUsd || 'N/A' },
    { id: 13, key: 'Quote Token Address', value: dexData.quoteToken?.address || 'N/A' },
    { id: 14, key: 'Quote Token Name', value: dexData.quoteToken?.name || 'N/A' },
    { id: 15, key: 'Quote Token Symbol', value: dexData.quoteToken?.symbol || 'N/A' },
    { id: 16, key: 'Volume (1h)', value: dexData.volume?.h1 || 'N/A' },
    { id: 17, key: 'Volume (24h)', value: dexData.volume?.h24 || 'N/A' },
    { id: 18, key: 'Volume (6h)', value: dexData.volume?.h6 || 'N/A' },
    { id: 19, key: 'Volume (5m)', value: dexData.volume?.m5 || 'N/A' },
    { id: 20, key: 'Buys (1h)', value: dexData.txns?.h1.buys || 'N/A' },
    { id: 21, key: 'Sells (1h)', value: dexData.txns?.h1.sells || 'N/A' },
    { id: 22, key: 'Buys (24h)', value: dexData.txns?.h24.buys || 'N/A' },
    { id: 23, key: 'Sells (24h)', value: dexData.txns?.h24.sells || 'N/A' },
    { id: 24, key: 'Buys (6h)', value: dexData.txns?.h6.buys || 'N/A' },
    { id: 25, key: 'Sells (6h)', value: dexData.txns?.h6.sells || 'N/A' },
    { id: 26, key: 'Buys (5m)', value: dexData.txns?.m5.buys || 'N/A' },
    { id: 27, key: 'Sells (5m)', value: dexData.txns?.m5.sells || 'N/A' },
  ];

  return (
    <Box className="currency-detail-container">
      <Navbar />
      <Box sx={{ display: 'flex', width: '100%' }}>
        <Sidebar />
        <Box className="main-content">
          <Box className="currency-detail-header">
            
          </Box>
          <Box className="currency-detail-table" sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={dexRows}
              columns={dexColumns}
              pageSize={10}
              sx={{
                '& .MuiDataGrid-cell': {
                  color: '#fff',
                },
                '& .MuiDataGrid-columnHeader': {
                  color: '#fff',
                },
                '& .MuiDataGrid-footerContainer': {
                  color: '#fff',
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CurrencyDetail;
