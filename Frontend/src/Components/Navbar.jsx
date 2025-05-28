import React from 'react';
import "./style.css";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "./AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg p-0">
      <div className="container-fluid pt-3" style={{ backgroundColor: "#c4dfe6" }}>
        <div className="collapse navbar-collapse">
          <div className="navbar-brand ps-4 mb-3 ms-5">
            <p className="m-0 logoo">SnowMow Solutions<i className="bi bi-snow ms-2"></i></p>
          </div>

          <ul className="navbar-nav ms-auto mb-3">
            <li className="nav-item ps-4">
              <Link to="/" className="nav-link darkcolor m-0" style={{ textDecoration: 'none' }}>
                Home
              </Link>
            </li>

            {/* ========== LOGGED IN ========== */}
            {user && (
              <>
                {/* ===== Admin View ===== */}
                {user.role === "admin" && (
                  <>
                    <li className="nav-item ps-4">
                      <Link to="/providersrequest" className="nav-link darkcolor m-0">Provider Requests</Link>
                    </li>
                    <li className="nav-item dropdown ps-4 mt-2">
                      <img
                        src={user.picture || "https://via.placeholder.com/30"}
                        alt="Admin"
                        className="rounded-circle me-2"
                        style={{ width: "30px", height: "30px", objectFit: "cover", cursor: "pointer" }}
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      />
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li><p className='dropdown-item'>{user.name || "Admin"}</p></li>
                        <li>
                          <button className="dropdown-item" onClick={handleLogout}>
                            Logout
                          </button>
                        </li>
                      </ul>
                    </li>
                  </>
                )}
{console.log("User:"+user.name+" "+user.role+" "+user.status+" "+user.picture+" "+user.email)}
                {/* ===== Customer View ===== */}
                {user.role === "customer" && (
                  <>
                    <li className="nav-item ps-4">
                      <Link to="/customer/dashboard" className="nav-link darkcolor m-0">My Bookings</Link>
                    </li>
                    <li className="nav-item ps-4">
                      <Link to="/services" className="nav-link darkcolor m-0">Services</Link>
                    </li>
                    <li className="nav-item dropdown ps-4 mt-2">
                      <img
                        src={user.picture || "https://via.placeholder.com/30"}
                        alt="User"
                        className="rounded-circle me-2"
                        style={{ width: "30px", height: "30px", objectFit: "cover", cursor: "pointer" }}
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      />
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li><p className='dropdown-item'>{user.name}</p></li>
                        <li>
                          <button className="dropdown-item" onClick={handleLogout}>
                            Logout
                          </button>
                        </li>
                      </ul>
                    </li>
                  </>
                )}

                {/* ===== Provider View ===== */}
                {user.role === "provider" && user.status=="approved" ? (
                  <>
                    <li className="nav-item ps-4">
                      <Link to="/provider/dashboard" className="nav-link darkcolor m-0">Provider Dashboard</Link>
                    </li>
                    <li className="nav-item dropdown ps-4 mt-2">
                      <img
                        src={user.picture || "https://via.placeholder.com/30"}
                        alt="Provider"
                        className="rounded-circle me-2"
                        style={{ width: "30px", height: "30px", objectFit: "cover", cursor: "pointer" }}
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      />
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li><p className='dropdown-item'>{user.name || "Provider"}</p></li>
                        <li>
                          <button className="dropdown-item" onClick={handleLogout}>
                            Logout
                          </button>
                        </li>
                      </ul>
                    </li>
                  </>
                ) : user.role === "provider" && user.status=="pending" || user.status=="rejected" ? (
                  <>
                    <li className="nav-item ps-4">
                      <Link to="/" className="nav-link darkcolor m-0" onClick={handleLogout}>
                        Return Home
                      </Link>
                    </li>
                  </>
                ) : null}
              </>
            )}

            {/* ========== NOT LOGGED IN ========== */}
            {!user && (
              <>
                <li className="nav-item ps-4">
                  <Link to="/servicesouterview" className="nav-link darkcolor m-0">Our Services</Link>
                </li>
                <li className="nav-item ps-4">
                  <Link to="/login" className="nav-link darkcolor m-0">Login</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
