import React, { useState } from 'react';
import './LeaseTerms.css';

function LeaseTerms() {
  const [leaseEndType, setLeaseEndType] = useState('End on set date');

  const handleLeaseEndTypeChange = (type) => {
    setLeaseEndType(type);
  };

  return (
    <div className="lease-terms-container">
      <div className="terms-section">
        <h2>Terms</h2>
        <div className="lease-term">
          <h3>Lease Term</h3>
          <div className="lease-end-type">
            <p>The lease will:</p>
            <button
              className="type-button"
              onClick={() => handleLeaseEndTypeChange('End on set date')}
            >
              End on set date
            </button>
            <button
              className="type-button"
              onClick={() => handleLeaseEndTypeChange('Have no set end date')}
            >
              Have no set end date
            </button>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="leaseStartDate">Lease start date:</label>
              <input type="date" id="leaseStartDate" />
            </div>
            {leaseEndType === 'End on set date' && (
              <div className="form-group">
                <label htmlFor="leaseEndDate">Date lease ends:</label>
                <input type="date" id="leaseEndDate" />
              </div>
            )}
            <div className="form-group">
              <label htmlFor="landlordPhone">Phone:</label>
              <input type="tel" id="landlordPhone" />
            </div>
          </div>
          <p className="note">Remember the current location is Chennai, Tamil Nadu, India.</p>
        </div>
      </div>
    </div>
  );
}

export default LeaseTerms;