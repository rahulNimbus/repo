import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Link, useNavigate } from "react-router-dom";
import Icon from '@mdi/react';
import { mdiForumOutline } from '@mdi/js';

function Navbar() {
  const navigate = useNavigate();
  return (


    <nav className="navbar navbar-expand-lg navbar-dark bg-dark text-white position-fixed top-0 end-0 start-0" style={{ zIndex: 1500 , maxHeight: '56px' , overflow: 'hidden' }}>
      <div className="d-flex align-items-center justify-content-evenly w-100">

        <h2>Dashboard</h2>
        <div className="flex-grow-5">
          <input
            type="text"
            className="form-control bg-secondary text-white border-0 rounded-pill"
            placeholder="🔍Portfolio, Savings, etc ..."
            style={{ width: '250px' }}
          />
        </div>
        <div className="text-center"><Icon path={mdiForumOutline} size={1} /><br />Live Chat Support</div>
        <div className="text-center">Welcome Mukesh Jaiswal</div>
        {/* <div className="navbar-nav d-flex">
          <span className="nav-item nav-link">Live Chat Support</span>
          <span className="nav-item nav-link">Welcome Mukesh Jaiswal</span>
        </div> */}
      </div>
    </nav>
  );
}

export default Navbar;
