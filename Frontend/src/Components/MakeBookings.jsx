import React, { useState, useEffect } from "react";
import axios from "axios";
import BookingForm from "./BookingForm"; // make sure path is correct

const locationOptions = [
  "New York",
  "Chicago",
  "Boston",
  "Denver",
  "Seattle",
  "Los Angeles",
];

export default function MakeBookings() {
  const [serviceType, setServiceType] = useState("");
  const [location, setLocation] = useState("");
  const [minRating, setMinRating] = useState("");
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);

  useEffect(() => {
    if (!serviceType) {
      setProviders([]);
      return;
    }

    const fetchProviders = async () => {
      setLoading(true);
      try {
        const params = {
          serviceType,
          ...(location && { location }),
          ...(minRating && { minRating }),
        };

        const { data } = await axios.get(
          "http://localhost:5000/api/auth/providers/search",
          { params }
        );
        setProviders(data);
      } catch (err) {
        console.error("Error fetching providers", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [serviceType, location, minRating]);

  return (
    <div className="container my-4">
      <h2>Select Service Type</h2>
      <div className="mb-3">
        <select
          className="form-select"
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
        >
          <option value="">-- Select Service --</option>
          <option value="Snow Mow">Snow Removal</option>
          <option value="Lawn Mow">Lawn Mowing</option>
        </select>
      </div>

      {serviceType && (
        <>
          <div className="mb-3">
            <label>Location (optional)</label>
            <select
              className="form-select"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">All locations</option>
              {locationOptions.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label>Minimum Rating (optional)</label>
            <select
              className="form-select"
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
            >
              <option value="">Any rating</option>
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} & up
                </option>
              ))}
            </select>
          </div>

          <hr />

          <h3>Providers</h3>
          {loading ? (
            <p>Loading...</p>
          ) : providers.length === 0 ? (
            <p>No providers found.</p>
          ) : (
            <div className="row">
              {providers.map((p) => (
                <div key={p.id} className="col-md-6 mb-3">
  <div className="card p-3 position-relative" style={{ minHeight: "220px" }}>
    <h5>Provider Name: {p.name}</h5>
    <p>Services: {p.services}</p>
    <p>Locations: {p.locations}</p>
    <p>
      Rating: {parseFloat(p.average_rating).toFixed(1)} ({p.review_count} reviews)
    </p>
    <p>
      Rate: $
      {serviceType === "Snow Mow" ? p.snowrate : p.lawnrate} per{" "}
      {serviceType === "Snow Mow" ? "hour" : "sq ft"}
    </p>
    <button
      className="btn btn-success position-absolute bottom-0 end-0 m-3 py-2"
      onClick={() => setSelectedProvider(p)}
    >
      Make a Booking
    </button>
  </div>
</div>

              ))}
            </div>
          )}
        </>
      )}

      {selectedProvider && (
        <BookingForm
          provider={selectedProvider}
          serviceType={serviceType}
          onClose={() => setSelectedProvider(null)}
        />
      )}
    </div>
  );
}
