import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useAuth } from "./AuthContext";

import { useNavigate } from "react-router-dom";
import "./style.css";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    if (!credentialResponse.credential) return;

    const decoded = jwtDecode(credentialResponse.credential);
    console.log("Decoded User Info:", decoded);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/google", {
        googleId: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        role: "customer", // explicitly send the role
      });
     const getRes = await axios.get("http://localhost:5000/api/auth/user", {
      params: { email: decoded.email },
    });

    const user = getRes.data;
    console.log("Fetched user from DB:", user);
    login(user);
      navigate("/");
    } catch (err) {
      console.error("Auth Error:", err.response?.data || err.message);
    }
  };
  const handleSuccess1 = async (credentialResponse) => {
    if (!credentialResponse.credential) return;

    const decoded = jwtDecode(credentialResponse.credential);
    console.log("Decoded User Info:", decoded);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/google", {
        googleId: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        role: "provider", // explicitly send the role
      });

      const getRes = await axios.get("http://localhost:5000/api/auth/user", {
      params: { email: decoded.email },
    });

    const user = getRes.data;
    console.log("Fetched user from DB:", user);
    login(user);

      // Check approval status
      if (user.role === "provider") {
        console.log("User role is provider:", user.is_approved);
        if (user.is_approved) {
          console.log("User role is provider:", user.is_approved);
          navigate("/");
        } else {  
          console.log("In waiting")
          navigate("/providerwaiting");
        }
      } else {
        alert("Unauthorized role");
      }
    } catch (err) {
      console.error("Auth Error:", err.response?.data || err.message);
      alert("Authentication failed. Please try again.");
    }
  };


  return (
    <div className="login-container">
      <h2 className="login-title">Login as Customer</h2>
      <div className="login-button">
        <GoogleLogin onSuccess={handleSuccess} onError={() => alert("Login Failed")} />
      </div>
      <h2 className="login-title mt-4">Login as Service Provider</h2>
      <div className="login-button">
        <GoogleLogin onSuccess={handleSuccess1} onError={() => alert("Login Failed")} />
      </div>
    </div>
  );
}

export default Login;
