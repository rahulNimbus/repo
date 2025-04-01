import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4 shadow-sm">
      <div className="container">
        <div className="navbar-brand" style={{cursor: "pointer"}} onClick={()=>navigate("/")} >
          FoodieLife
        </div>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto me-3">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/auth">
                Login/Signup
              </Link>
            </li>
            <li className="nav-item d-flex align-items-center ms-1">
              <form className="d-flex px-0 flex-row" role="search">
                <input
                  className="form-control form-control-sm me-2"
                  type="search"
                  placeholder="Search recipes..."
                  aria-label="Search"
                />
                <button
                  className="btn btn-outline-primary btn-sm"
                  type="submit"
                >
                  Search
                </button>
              </form>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
