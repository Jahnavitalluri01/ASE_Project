import React, { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

import axios from "axios";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import "./style.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [isProvider, setIsProvider] = useState(false);
  const [formValid, setFormValid] = useState(false);

  const [providerDetails, setProviderDetails] = useState({
    locations: [],
    services: [],
    snowRate: "",
    lawnRate: "",
    experience: "",
    mobilenumber: "",
    ssn: "",
    about: "",
  });

  const locationOptions = [
    { value: "Overland Park", label: "Overland Park" },
    { value: "Kansas City", label: "Kansas City" },
    { value: "Lee's Summit", label: "Lee's Summit" },
  ];

  const validateMobileNumber = (number) =>
    /^\+?[0-9]{7,15}$/.test(number.trim());

  // Simple SSN validation (basic check for 9 digits, can be customized)
  const validateSSN = (ssn) => /^\d{9}$/.test(ssn.trim());

  // Validate if all fields are filled and mobile is valid
  const validateProviderDetails = () => {
    const {
      locations,
      services,
      snowRate,
      lawnRate,
      experience,
      mobilenumber,
      ssn,
      about,
    } = providerDetails;

    if (
      locations.length === 0 ||
      services.length === 0 ||
      (services.includes("Snow Removal") && !snowRate) ||
      (services.includes("Lawn Mowing") && !lawnRate) ||
      !experience ||
      !mobilenumber.trim() ||
      !validateMobileNumber(mobilenumber) ||
      !ssn.trim() ||
      !validateSSN(ssn) ||
      !about.trim()
    ) {
      setFormValid(false);
      return false;
    }

    setFormValid(true);
    return true;
  };

  const handleGoogle = async (credentialResponse) => {
    if (isProvider && !validateProviderDetails()) {
      alert("Please fill all details correctly before submitting.");
      return;
    }

    if (!credentialResponse.credential) return;

    const decoded = jwtDecode(credentialResponse.credential);
    const role = isProvider ? "provider" : "customer";

    const body = {
      googleId: decoded.sub,
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
      role,
      status: isProvider ? "pending" : "approved",
      ...(role === "provider" ? providerDetails : {}),
    };

    try {
      const { data } = await axios.post(
        "https://snowmow.online/api/auth/google",
        body
      );
      const user = data.user;

      login(user);

      if (user.role === "provider") {
        if (user.status === "approved") navigate("/");
        else if (user.status === "pending") navigate("/providerwaiting");
        else navigate("/providerrequestrejected");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Auth Error:", err);
      alert("Authentication failed.");
    }
  };

  // Run validation whenever provider details change or role changes
  useEffect(() => {
    if (isProvider) {
      validateProviderDetails();
    } else {
      setFormValid(true); // customer login always enabled
    }
  }, [providerDetails, isProvider]);

  const onInputChange = (field, value) => {
    setProviderDetails((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        <h2 className="brand-title mb-3">SnowMow Solutions</h2>
        <p className="brand-subtitle mb-4">Simplifying outdoor maintenance</p>

        {!isProvider ? (
          <>
            <div className="google-login-wrapper mb-3">
              <GoogleLogin
                onSuccess={handleGoogle}
                onError={() => alert("Login Failed")}
                theme="filled_blue"
                size="large"
                width="100%"
              />
            </div>
            <p className="provider-toggle">
              Want to become a service provider?{" "}
              <span
                onClick={() => {
                  setIsProvider(true);
                  setProviderDetails({
                    locations: [],
                    services: [],
                    snowRate: "",
                    lawnRate: "",
                    experience: "",
                    mobilenumber: "",
                    ssn: "",
                    about: "",
                  });
                  setFormValid(false);
                }}
                style={{
                  cursor: "pointer",
                  color: "#007bff",
                  textDecoration: "underline",
                }}
              >
                Click here
              </span>
            </p>
          </>
        ) : (
          <>
            {/* Provider form */}
            <div className="provider-form mt-3">
              <label>Locations</label>
              <Select
                isMulti
                options={locationOptions}
                className="mb-3"
                onChange={(selected) => {
                  onInputChange(
                    "locations",
                    selected ? selected.map((o) => o.value) : []
                  );
                }}
                value={locationOptions.filter((o) =>
                  providerDetails.locations.includes(o.value)
                )}
              />

              <label>Services Offered</label>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="Snow Removal"
                  checked={providerDetails.services.includes("Snow Removal")}
                  onChange={(e) => {
                    const val = e.target.value;
                    let newServices = [];
                    if (e.target.checked)
                      newServices = [...providerDetails.services, val];
                    else
                      newServices = providerDetails.services.filter(
                        (s) => s !== val
                      );
                    onInputChange("services", newServices);
                  }}
                />
                <label className="form-check-label">Snow Removal</label>
              </div>

              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="Lawn Mowing"
                  checked={providerDetails.services.includes("Lawn Mowing")}
                  onChange={(e) => {
                    const val = e.target.value;
                    let newServices = [];
                    if (e.target.checked)
                      newServices = [...providerDetails.services, val];
                    else
                      newServices = providerDetails.services.filter(
                        (s) => s !== val
                      );
                    onInputChange("services", newServices);
                  }}
                />
                <label className="form-check-label">Lawn Mowing</label>
              </div>

              {providerDetails.services.includes("Snow Removal") && (
                <div className="mb-3">
                  <label>Snow Removal Rate ($/hr)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={providerDetails.snowRate}
                    onChange={(e) => onInputChange("snowRate", e.target.value)}
                  />
                </div>
              )}

              {providerDetails.services.includes("Lawn Mowing") && (
                <div className="mb-3">
                  <label>Lawn Mowing Rate ($/sq.ft)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={providerDetails.lawnRate}
                    onChange={(e) => onInputChange("lawnRate", e.target.value)}
                  />
                </div>
              )}

              <label>Experience</label>
              <select
                className="form-select mb-3"
                value={providerDetails.experience}
                onChange={(e) => onInputChange("experience", e.target.value)}
              >
                <option value="">Select experience</option>
                <option value="1">1 year</option>
                <option value="2">2 years</option>
                <option value="3">3 years</option>
                <option value="4">4 years</option>
                <option value="5+">5+ years</option>
              </select>

              {/* Mobile Number at the bottom */}
              <div className="mb-3">
                <label>Mobile Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={providerDetails.mobilenumber}
                  onChange={(e) => onInputChange("mobilenumber", e.target.value)}
                />
              </div>

              {/* New SSN Number */}
              <div className="mb-3">
                <label>SSN Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={providerDetails.ssn}
                  onChange={(e) => onInputChange("ssn", e.target.value)}
                  placeholder="9 digit SSN"
                />
              </div>

              {/* New About Me / Description */}
              <div className="mb-3">
                <label>Tell Us About Your Work</label>
                <textarea
                  className="form-input"
                  rows={4}
                  value={providerDetails.about}
                  onChange={(e) => onInputChange("about", e.target.value)}
                  placeholder="Share details about your expertise and services offered"
                />
              </div>
            </div>

            {/* Google Login button disabled until formValid */}
            <div
              style={{
                pointerEvents: formValid ? "auto" : "none",
                opacity: formValid ? 1 : 0.6,
                transition: "opacity 0.3s ease",
                width: "100%",
              }}
            >
              <GoogleLogin
                onSuccess={handleGoogle}
                onError={() => alert("Login Failed")}
                theme="filled_blue"
                size="large"
                width="100%"
                useOneTap={false}
              />
            </div>

            {/* Back to customer login */}
            <div className="text-center mt-3">
              <small
                onClick={() => {
                  setIsProvider(false);
                  setProviderDetails({
                    locations: [],
                    services: [],
                    snowRate: "",
                    lawnRate: "",
                    experience: "",
                    mobilenumber: "",
                    ssn: "",
                    about: "",
                  });
                  setFormValid(true);
                }}
                style={{
                  cursor: "pointer",
                  color: "#007bff",
                  textDecoration: "underline",
                }}
              >
                Back to customer login
              </small>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
