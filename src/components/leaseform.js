import React, { useState } from 'react';
import './leaseform.css';

function LeaseForm() {
  const [formData, setFormData] = useState({
    location: 'Tamil Nadu',
    landlordName: '',
    landlordAddress: '',
    landlordPhone: '',
    leaseStartDate: '',
    leaseEndDate: '',
    earlyPossessionAllowed: false,
    electricityPaidByTenant: false,
    waterPaidByTenant: false,
    sewerPaidByTenant: false,
    otherExpenses: ''
  });
/*
  const [steps] = useState([
    { id: 'generalInfo', label: 'General Info', status: 'pending' },
    { id: 'parties', label: 'Parties', status: 'pending' },
    { id: 'property', label: 'Property', status: 'pending' },
    { id: 'terms', label: 'Terms', status: 'pending' },
    { id: 'costs', label: 'Costs', status: 'pending' },
    { id: 'clauses', label: 'Clauses', status: 'pending' },
    { id: 'finalDetails', label: 'Final Details', status: 'pending' },
    { id: 'download', label: 'Download', status: 'pending' }
  ]);
  */

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Get JWT token

    console.log("Form data :" , formData);

    try {
        const response = await fetch('http://localhost:8070/api/lease/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Attach JWT token
            },
            body: JSON.stringify(formData) // Convert form data to JSON
        });

        if (response.ok) {
            const data = await response.json();
            alert('Lease Agreement Saved Successfully!');
            console.log('Saved Data:', data);
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (err) {
        console.error('API Error:', err);
        alert('Something went wrong. Please try again.');
    }
};


  return (
    <div className="lease-form-container">
      <div className="top-bar">
        <div className="top-bar-item">
          <span className="icon">&#128187;</span>
          <span>Answer a few simple questions</span>
        </div>
        <div className="top-bar-item">
          <span className="icon">&#9998;</span>
          <span>Electronic Signature Service</span>
        </div>
        <div className="top-bar-item">
          <span className="icon">&#128438;</span>
          <span>Print and download instantly</span>
        </div>
      </div>


      <div className="content">
        <form onSubmit={handleSubmit}>
          {/* General Info */}
          <div className="section">
            <h2>General Info</h2>
            <h3>Customised Lease</h3>
            <div className="form-group">
              <label htmlFor="propertyLocation">Location of Property:</label>
              <select id="propertyLocation" name="propertyLocation" value={formData.propertyLocation} onChange={handleChange}>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Kerala">Kerala</option>
              </select>
            </div>
          </div>

          {/* Landlord Details */}
          <div className="section">
            <h2>Landlord Details</h2>
            <div className="form-group">
              <label htmlFor="landlordName">Landlord Name:</label>
              <input type="text" id="landlordName" name="landlordName" value={formData.landlordName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="landlordAddress">Address:</label>
              <input type="text" id="landlordAddress" name="landlordAddress" value={formData.landlordAddress} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="landlordPhone">Phone:</label>
              <input type="tel" id="landlordPhone" name="landlordPhone" value={formData.landlordPhone} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="rentAmount">Rent Amount:</label>
              <input type="text" id="rentAmount" name="rentAmount" value={formData.rentAmount} onChange={handleChange} required />
            </div>
          </div>

          {/* Lease Terms */}
          <div className="section">
            <h2>Lease Terms</h2>
            <div className="form-group">
              <label htmlFor="leaseStartDate">Lease Start Date:</label>
              <input type="date" id="leaseStartDate" name="leaseStartDate" value={formData.leaseStartDate} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="leaseEndDate">Lease End Date:</label>
              <input type="date" id="leaseEndDate" name="leaseEndDate" value={formData.leaseEndDate} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>
                <input type="checkbox" name="earlyPossessionAllowed" checked={formData.earlyPossessionAllowed} onChange={handleChange} />
                Early Possession Allowed?
              </label>
            </div>
          </div>

          {/* Utility & Other Expenses */}
          <div className="section">
            <h2>Utility & Other Expenses</h2>
            <div className="form-group">
              <label>
                <input type="checkbox" name="electricityPaidByTenant" checked={formData.electricityPaidByTenant} onChange={handleChange} />
                Electricity Paid by Tenant
              </label>
            </div>
            <div className="form-group">
              <label>
                <input type="checkbox" name="waterPaidByTenant" checked={formData.waterPaidByTenant} onChange={handleChange} />
                Water Paid by Tenant
              </label>
            </div>
            <div className="form-group">
              <label>
                <input type="checkbox" name="sewerPaidByTenant" checked={formData.sewerPaidByTenant} onChange={handleChange} />
                Sewer Paid by Tenant
              </label>
            </div>
            <div className="form-group">
              <label htmlFor="otherExpenses">Other Expenses:</label>
              <input type="text" id="otherExpenses" name="otherExpenses" value={formData.otherExpenses} onChange={handleChange} />
            </div>
          </div>

          <button type="submit" className="submit-btn">Submit Lease Agreement</button>
        </form>

        <p className="note">Remember the current location is Chennai, Tamil Nadu, India.</p>
      </div>
    </div>
  );
}

export default LeaseForm;
