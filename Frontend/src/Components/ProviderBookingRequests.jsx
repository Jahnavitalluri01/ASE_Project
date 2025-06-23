import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const ProviderBookingRequests = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  useEffect(() => {
    fetchBookingRequests();
  }, []);

  const fetchBookingRequests = async () => {
    try {
      const res = await axios.get(`https://snowmow.online/api/bookings/provider/${user.id}`);
      setBookings(res.data || []);
    } catch (err) {
      console.error("Error fetching booking requests", err);
    }
  };

  const handleAccept = async (id) => {
    try {
      await axios.put(`https://snowmow.online/api/bookings/accept/${id}`);
      fetchBookingRequests();
    } catch (err) {
      console.error("Accept error", err);
    }
  };

  const openRejectModal = (id) => {
    setSelectedBookingId(id);
    setRejectReason("");
    setShowModal(true);
  };

const { token } = useAuth();

const confirmReject = async () => {
  try {
    await axios.patch(
      `https://snowmow.online/api/bookings/provider/reject/${selectedBookingId}`,
      { reason: rejectReason },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setShowModal(false);
    fetchBookingRequests();
  } catch (err) {
    console.error("Rejection failed", err);
  }
};


  return (
    <div className="container mt-5">
      <h2 className="mb-4">Booking Requests</h2>
      {bookings.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        bookings
          .filter((booking) => booking.status === "pending")
          .map((booking) => (
            <div key={booking.id} className="card p-3 mb-3 shadow-sm">
              <h5>Customer: {booking.customer_name}</h5>
              <p>Service: {booking.service_type}</p>
              <p>Date: {booking.date}</p>
              <p>Time: {booking.time}</p>
              <p>Location: {booking.location}</p>
              <div>
                <button className="btn btn-success me-2" onClick={() => handleAccept(booking.id)}>
                  Accept
                </button>
                <button className="btn btn-danger" onClick={() => openRejectModal(booking.id)}>
                  Reject
                </button>
              </div>
            </div>
          ))
      )}

      {/* Rejection Modal */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reject Booking</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <textarea
                  className="form-control"
                  placeholder="Enter rejection reason"
                  rows="4"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-danger" onClick={confirmReject}>Confirm Reject</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderBookingRequests;