import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useAuth } from "./AuthContext";

export default function BookingForm({ provider, serviceType, onClose }) {
     const { user } = useAuth();
  const [date, setDate] = useState(null);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [location, setLocation] = useState("");
  const [sqft, setSqft] = useState("");
  const [hours, setHours] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");
  const [totalCost, setTotalCost] = useState(null);

  const rate =
    serviceType === "Snow Mow" ? provider.snowrate : provider.lawnrate;

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/bookings/unavailable-dates`, {
        params: { providerId: provider.id },
      })
      .then((res) => {
        setUnavailableDates(res.data.map((d) => new Date(d)));
      });
  }, [provider.id]);

  useEffect(() => {
    let base = 0;
    if (serviceType === "Lawn Mow" && sqft && rate) {
      base = sqft * rate;
    } else if (serviceType === "Snow Mow" && hours && rate) {
      base = hours * rate;
    }

    if (base > 0) {
      const withAdmin = base + base * 0.05; // 5% admin fee
      const withTax = withAdmin + withAdmin * 0.05; // 5% tax
      setTotalCost(withTax.toFixed(2));
    } else {
      setTotalCost(null);
    }
  }, [sqft, hours, rate, serviceType]);

  const handleSubmit = async () => {
  const bookingDetails = {
    customerId: user.id, // TODO: Replace with actual logged-in user ID (e.g., from context or localStorage)
    providerId: provider.id,
    serviceType,
    location,
    date: date?.toISOString(), // Convert to string for backend
    estimatedHours: serviceType === "Snow Mow" ? Number(hours) : null,
    sqft: serviceType === "Lawn Mow" ? Number(sqft) : null,
    specialRequest,
    rate, // This is calculated earlier in the component
  };

  try {
    await axios.post("http://localhost:5000/api/bookings/request", bookingDetails);
    alert("Booking requested!");
    onClose();
  } catch (error) {
    console.error("Booking failed:", error?.response?.data || error.message);
    alert("Booking failed. Check console for details.");
  }
};


  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content p-3">
          <h5>Request Booking with {provider.name}</h5>
          <p><strong>Service Type:</strong> {serviceType}</p>

          <div className="mb-2">
            <label>Choose Date</label>
            <DatePicker
              selected={date}
              onChange={(d) => setDate(d)}
              excludeDates={unavailableDates}
              minDate={new Date()}
              className="form-control"
              placeholderText="Select a booking date"
            />
          </div>

          <div className="mb-2">
            <label>Your Location</label>
            <input
              className="form-control"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {serviceType === "Lawn Mow" && (
            <div className="mb-2">
              <label>Square Feet</label>
              <input
                type="number"
                className="form-control"
                value={sqft}
                onChange={(e) => setSqft(e.target.value)}
              />
            </div>
          )}

          {serviceType === "Snow Mow" && (
            <div className="mb-2">
              <label>Estimated Time (in hours)</label>
              <input
                type="number"
                className="form-control"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
            </div>
          )}

          <div className="mb-2">
            <label>Special Request</label>
            <textarea
              className="form-control"
              value={specialRequest}
              onChange={(e) => setSpecialRequest(e.target.value)}
            />
          </div>

          {totalCost && (
            <p><strong>Total Cost: ${totalCost}</strong></p>
          )}

          <div className="d-flex justify-content-end mt-3">
            <button className="btn btn-primary me-2" onClick={handleSubmit}>
              Request Booking
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
