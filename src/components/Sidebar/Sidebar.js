import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { FaHome, FaChartLine, FaArrowUp, FaArrowCircleUp } from 'react-icons/fa';
import './Sidebar.css';


const Sidebar = () => {
  return (
    <div className="sidebar">
      <Nav defaultActiveKey="/Token" className="flex-column">
        <Nav.Link as={NavLink} to="/dashboard">
          <FaHome className="nav-icon" /> Token
        </Nav.Link>
        <Nav.Link as={NavLink} to="/analytics">
          <FaChartLine className="nav-icon" /> Analytics
        </Nav.Link>
        <Nav.Link as={NavLink} to="/TopGainer">
          <FaArrowUp className="nav-icon" /> Top Gainer
        </Nav.Link>
        <Nav.Link as={NavLink} to="/TopVolume">
          <FaArrowCircleUp className="nav-icon" /> Top Volume
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
