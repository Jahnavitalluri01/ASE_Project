import React from 'react';
import "./style.css";
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg p-0">
      <div className="container-fluid pt-3" style={{ backgroundColor: "#C6AA58" }}>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto mb-3">
            <li className="nav-item ps-4">
              <Link to='/' className="nav-link darkcolor m-0" style={{ textDecoration: 'none' }}>
                Home
              </Link>
            </li>
            <li className="nav-item ps-4">
              <p className="nav-link m-0 darkcolor">About Us</p>
            </li>
            <li className="nav-item ps-4">
              <p className="nav-link m-0 darkcolor">Services</p>
            </li>
            <li className="nav-item ps-4">
              <p className="nav-link m-0 darkcolor">Login/SignUp</p>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
