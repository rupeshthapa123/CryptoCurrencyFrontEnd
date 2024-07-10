import React from 'react';
import './Navbar.css';
import { FaSearch } from 'react-icons/fa';
import logo from '../../assets/images/logo.png';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container-fluid">
        <div className="navbar-logo">
          <a href='/dashboard' ><img src={logo} alt="Logo" /></a>
        </div>
        <div className="navbar-search input-box">
          <input type="text" placeholder="Search..." />
          <FaSearch className="icon" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
