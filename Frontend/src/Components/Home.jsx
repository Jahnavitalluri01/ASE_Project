import React from "react";
import "./style.css";
import { useAuth } from "./AuthContext";

function Home() {
  const { user, logout } = useAuth();
  return (
    <div className="home-container">
      <div className="home-content">
        { user && (
        <p className="fs-3">Welcome <span style={{textTransform:"capitalize"}}>{user.role}</span></p>
        )
}
        <p className="homeheading">
          SnowMow Solutions – Making Outdoor Maintenance Easy
        </p>
        <p className="homepagepara">
          Mow Less. Worry Less. Live More.
        </p>
        {/* Optional paragraph */}
        {/* <p className="homepagepara" style={{ fontSize: '1.25rem', marginTop: '1rem' }}>
          SnowMow Solutions is your all-in-one platform for snow removal and lawn mowing services, built to bring transparency, convenience, and reliability right to your doorstep.
          Whether it's winter snow or summer grass, we keep your property pristine—without the stress.
        </p> */}
      </div>
    </div>
  );
}

export default Home;

