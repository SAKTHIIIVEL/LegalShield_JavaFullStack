import React from 'react';
import './PartiesProperty.css';

function PartiesProperty() {
  return (
    <div className="parties-property-container">
      <div className="parties-section">
        <h2>Parties</h2>
        <div className="landlord-details">
          <h3>Landlord Details</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="landlordName">Name:</label>
              <input type="text" id="landlordName" />
            </div>
            <div className="form-group">
              <label htmlFor="landlordAddress">Address:</label>
              <input type="text" id="landlordAddress" placeholder="e.g. Building, Street, Locality, City, State, Pincode" />
            </div>
            <div className="form-group">
              <label htmlFor="landlordPhone">Phone:</label>
              <input type="tel" id="landlordPhone" />
            </div>
          </div>
        </div>
      </div>

      <div className="property-section">
        <h2>Property</h2>
        <div className="leased-property">
          <h3>Leased Property</h3>
          <div className="form-group">
            <label htmlFor="propertyAddress">Property Location Address:</label>
            <input type="text" id="propertyAddress" />
          </div>
          <p className="note">Remember the current location is Chennai, Tamil Nadu, India.</p>
        </div>
      </div>
    </div>
  );
}

export default PartiesProperty;