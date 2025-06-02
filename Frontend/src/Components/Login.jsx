import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import "./style.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  // toggle showing the provider detail form
  const [isProvider, setIsProvider] = useState(false);
  const [providerDetails, setProviderDetails] = useState({
  locations: [],
  services: [],
  snowRate: "",
  lawnRate: "",
  experience: "",
});


  const locationOptions = [
    { value: "New York", label: "New York" },
    { value: "Chicago", label: "Chicago" },
    { value: "Boston", label: "Boston" },
    { value: "Denver", label: "Denver" },
    { value: "Seattle", label: "Seattle" },
    { value: "Los Angeles", label: "Los Angeles" },
  ];

  const handleGoogle = async (credentialResponse) => {
    if (!credentialResponse.credential) return;
    const decoded = jwtDecode(credentialResponse.credential);
    const role = isProvider ? "provider" : "customer";

    // build the body
    const body = {
      googleId: decoded.sub,
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
      role,
      ...(role === "provider" ? providerDetails : {}),
    };

    try {
      // call your backend
      await axios.post("http://localhost:5000/api/auth/google", body);
      const { data: user } = await axios.get("http://localhost:5000/api/auth/user", {
        params: { email: decoded.email },
      });

      // set into context
      login(user);

      // redirect depending on role/status
      if (user.role === "provider") {
        if (user.status === "approved") navigate("/");
        else if (user.status === "pending") navigate("/providerwaiting");
        else navigate("/providerrequestrejected");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Auth Error:", err);
      alert("Authentication failed. Please try again.");
    }
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center py-5" style={{ minHeight: "100vh" }}>
      <div className="login-box">
        <h2 className="login-title">Login</h2>

        {/* Provider details form */}
        {isProvider && (
          <div className="provider-form">
            <h5 className="form-heading">Service Provider Details</h5>
 <div><button
              className="btn btn-light my-3"
              onClick={() => setIsProvider(false)}
            >
              &larr; Back to Login
            </button>
            </div>
            <label>Locations</label>
            <Select
              isMulti
              options={locationOptions}
              placeholder="Select locations…"
              className="mb-3"
              onChange={(selected) =>
                setProviderDetails((d) => ({
                  ...d,
                  locations: selected ? selected.map((o) => o.value) : [],
                }))
              }
              value={locationOptions.filter((o) =>
                providerDetails.locations.includes(o.value)
              )}
            />

            <label>Services Offered</label>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value="Snow Mow"
                id="snow"
                checked={providerDetails.services.includes("Snow Mow")}
                onChange={(e) => {
                  const val = e.target.value;
                  setProviderDetails((p) => ({
                    ...p,
                    services: e.target.checked
                      ? [...p.services, val]
                      : p.services.filter((s) => s !== val),
                  }));
                }}
              />
              <label className="form-check-label" htmlFor="snow">
                Snow Mow
              </label>
            </div>
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                value="Lawn Mow"
                id="lawn"
                checked={providerDetails.services.includes("Lawn Mow")}
                onChange={(e) => {
                  const val = e.target.value;
                  setProviderDetails((p) => ({
                    ...p,
                    services: e.target.checked
                      ? [...p.services, val]
                      : p.services.filter((s) => s !== val),
                  }));
                }}
              />
              <label className="form-check-label" htmlFor="lawn">
                Lawn Mow
              </label>
            </div>

            {/* Snow Mow Rate */}
{providerDetails.services.includes("Snow Mow") && (
  <div className="mb-3">
    <label>Snow Mow Rate ($/hour)</label>
    <input
      type="number"
      className="form-input"
      placeholder="e.g., 40"
      value={providerDetails.snowRate || ""}
      onChange={(e) =>
        setProviderDetails((prev) => ({
          ...prev,
          snowRate: e.target.value,
        }))
      }
    />
  </div>
)}

{/* Lawn Mow Rate */}
{providerDetails.services.includes("Lawn Mow") && (
  <div className="mb-3">
    <label>Lawn Mow Rate ($/sq.ft)</label>
    <input
      type="number"
      className="form-input"
      placeholder="e.g., 0.15"
      value={providerDetails.lawnRate || ""}
      onChange={(e) =>
        setProviderDetails((prev) => ({
          ...prev,
          lawnRate: e.target.value,
        }))
      }
    />
  </div>
)}


            <label>Experience</label>
            <select
              className="form-select mb-3"
              value={providerDetails.experience}
              onChange={(e) =>
                setProviderDetails({
                  ...providerDetails,
                  experience: e.target.value,
                })
              }
            >
              <option value="">Select experience</option>
              <option value="1">1 year</option>
              <option value="2">2 years</option>
              <option value="3">3 years</option>
              <option value="4">4 years</option>
              <option value="5+">5+ years</option>
            </select>

           
          </div>
        )}

        {/* Single GoogleLogin button */}
        <div className="google-login-wrapper">
  <GoogleLogin
    onSuccess={handleGoogle}
    onError={() => alert("Login Failed")}
    theme="filled_blue"  // makes it blue
    size="large"
    width="100%"
  />
</div>


        {/* Toggle link */}
        {!isProvider && (
          <p className="toggle-provider" onClick={() => setIsProvider(true)}>
            Want to become a service provider?{" "}
            <span style={{textDecoration:"none"}}>Request</span>
          </p>
        )}
      </div>
    </div>
  );
}
