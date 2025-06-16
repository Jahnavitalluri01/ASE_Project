import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';

const PaymentSuccess = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const updateStatus = async () => {
      await axios.patch(`http://localhost:5002/api/bookings/mark-paid/${bookingId}`);
      setTimeout(() => navigate('/my-bookings'), 2000);
    };
    updateStatus();
  }, [bookingId, navigate]);

  return (
    <div className="text-center mt-5">
      <h2>✅ Payment Successful!</h2>
      <p>Redirecting to your bookings...</p>
    </div>
  );
};

export default PaymentSuccess;
