import React from "react";
import "./style.css";

function Services() {
  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-primary">Our Services</h1>
      <p>Explore the range of solutions we offer to help you grow your business.</p>
      
      <div className="row g-4 mt-3">
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Snow Removal</h5>
              <p className="card-text">
                Efficient and reliable snow removal services for residential and commercial properties.
              </p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Lawn Maintenance</h5>
              <p className="card-text">
                Comprehensive lawn care including mowing, trimming, and fertilization.
              </p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Landscaping</h5>
              <p className="card-text">
                Professional landscaping design and installation services to enhance your outdoor space.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;
