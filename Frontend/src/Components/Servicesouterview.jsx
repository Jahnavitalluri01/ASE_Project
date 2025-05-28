import React from "react";
import "./style.css"; // For background and other custom styles

function Servicesouterview() {
  return (
    <div className="services-background">
      <div className="container">
        <h2 className="text-center fw-bold mb-4">Our Services</h2>
        <p className="text-center mb-5 text-light fs-4">
          Choose from our high-quality services for your seasonal needs.
        </p>

        <div className="row justify-content-center g-4">
          {/* Snow Removal Card */}
          <div className="col-sm-10 col-md-6 col-lg-4">
            <div className="card service-card shadow-sm h-100">
              <div className="card-body text-center">
                <i className="bi bi-snow display-4 text-info mb-3"></i>
                <h5 className="card-title fw-bold">Snow Removal</h5>
                <p className="card-text text-muted">
                  Efficient snow clearing to keep your driveways and sidewalks safe.
                </p>
                <ul className="list-unstyled text-start mb-3 fs-5">
                  <li><i className="bi bi-check-circle-fill text-success me-2"></i>Driveways & Walkways</li>
                  <li><i className="bi bi-check-circle-fill text-success me-2"></i>Quick Response Team</li>
                  <li><i className="bi bi-check-circle-fill text-success me-2"></i>Hourly Pricing</li>
                </ul>
                <p className="fw-bold text-info fs-5">$40/hr</p>
                <button className="btn btn-outline-info fs-5 fw-bold">Book Snow Removal</button>
              </div>
            </div>
          </div>

          {/* Lawn Mowing Card */}
          <div className="col-sm-10 col-md-6 col-lg-4">
            <div className="card service-card shadow-sm h-100">
              <div className="card-body text-center">
                <i className="bi bi-tree-fill display-4 text-success mb-3"></i>
                <h5 className="card-title fw-bold">Lawn Mowing</h5>
                <p className="card-text text-muted">
                  Keep your yard neat and green with our professional mowing service.
                </p>
                <ul className="list-unstyled text-start mb-3 fs-5">
                  <li><i className="bi bi-check-circle-fill text-success me-2"></i>Per Sq. Ft Pricing</li>
                  <li><i className="bi bi-check-circle-fill text-success me-2"></i>Clean Finish</li>
                  <li><i className="bi bi-check-circle-fill text-success me-2"></i>Flexible Scheduling</li>
                </ul>
                <p className="fw-bold text-success fs-5">$0.10 / sq.ft</p>
                <button className="btn btn-outline-success fs-5 fw-bold">Book Mowing</button>
              </div>
            </div>
          </div>
        </div>
<div className="login-prompt text-center mt-4">
  <p className="fs-4 text-white"><strong>Login to book services and manage your requests!</strong></p>
<button 
  className="btn custom-login-btn fs-4"
  onClick={() => window.location.href = "/login"}
>
  Go to Login
</button>

</div>

       
       
      </div>
    </div>
  );
}

export default Servicesouterview;
