import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (user?.id) fetchMyBookings();
  }, [user]);

  const fetchMyBookings = async () => {
    try {
      const res = await axios.get(`https://snowmow.online/api/bookings/customer/${user.id}`);
      setBookings(res.data || []);
    } catch (err) {
      console.error("Error fetching bookings", err);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const today = new Date();
    const bookingDate = new Date(booking.date);
    switch (filter) {
      case "upcoming":
        return booking.status === "approved" && bookingDate >= today;
      case "completed":
        return booking.status === "completed";
      case "rejected":
        return booking.status === "rejected";
      case "in_progress":
        return booking.status=== "in_progress";
      case "all":
      default:
        return true;
    }
  });

  return (
    <div className="container mt-5">
      <h2 className="mb-4">My Bookings</h2>

      {/* Filter Controls */}
      <div className="mb-4">
        <button className={`btn me-2 ${filter === "all" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setFilter("all")}>
          All
        </button>
         <button className={`btn me-2 ${filter === "in_progress" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setFilter("in_progress")}>
          In Progress
        </button>
        <button className={`btn me-2 ${filter === "upcoming" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setFilter("upcoming")}>
          Upcoming
        </button>
        <button className={`btn me-2 ${filter === "completed" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setFilter("completed")}>
          Completed
        </button>
        <button className={`btn me-2 ${filter === "rejected" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setFilter("rejected")}>
          Rejected
        </button>
        
      </div>

      {filteredBookings.length === 0 ? (
        <p>No bookings found for selected filter.</p>
      ) : (
        filteredBookings.map((booking) => (
          <div key={booking.id} className="card p-3 mb-3 shadow-sm">
            <h5>Provider: {booking.provider_name}</h5>
            <p>Service: {booking.service_type}</p>
            <p>Date: {booking.date}</p>
            <p>Time: {booking.time}</p>
            <p>Location: {booking.location}</p>
            <p>Status: <strong>{booking.status}</strong></p>

            {/* Show rejection reason if rejected */}
            {booking.status === "rejected" && booking.rejection_reason && (
              <p className="text-danger">
                <strong>Rejection Reason:</strong> {booking.rejection_reason}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MyBookings;