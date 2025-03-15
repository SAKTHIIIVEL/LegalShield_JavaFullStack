import React, { useState, useRef, useEffect } from 'react';
import './FinalDetailsDownload.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import InstagramIcon from '@mui/icons-material/Instagram';
import { FacebookOutlined, LinkedIn, Twitter } from '@mui/icons-material';

function FinalDetailsDownload() {
  const [leaseRenewalOption, setLeaseRenewalOption] = useState('No option specified');
  const [signatureDataUrl1, setSignatureDataUrl1] = useState(null);
  const [signatureDataUrl2, setSignatureDataUrl2] = useState(null);
  const [isDrawing1, setIsDrawing1] = useState(false);
  const [isDrawing2, setIsDrawing2] = useState(false);
  const [leaseAgreements, setLeaseAgreements] = useState([]); // List of agreements
  const [selectedAgreement, setSelectedAgreement] = useState(null); // Selected agreement
  const [leaseClauses, setLeaseClauses] = useState([]);
  const [lastX1, setLastX1] = useState(0);
  const [lastY1, setLastY1] = useState(0);
  const [lastX2, setLastX2] = useState(0);
  const [lastY2, setLastY2] = useState(0);
  const canvasRef1 = useRef(null);
  const canvasRef2 = useRef(null);

  

  const handleLeaseRenewalChange = (option) => {
    setLeaseRenewalOption(option);
  };

  useEffect(() => {
    fetchLeaseAgreements();
  }, []);

  useEffect(() => {
    fetchLeaseClauses().then(data => {
      if (data) setLeaseClauses(data);
    });
}, []);

  const fetchLeaseAgreements = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("User is not logged in.");
        return;
      }

      const response = await fetch("http://localhost:8070/api/lease/user", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch lease agreements");
      }

      const data = await response.json();
      setLeaseAgreements(data);
      setSelectedAgreement(data.length > 0 ? data[0] : null); // Select first agreement by default
    } catch (error) {
      console.error("Error fetching agreements:", error);
    }
  };

  const fetchLeaseClauses = async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("User is not logged in.");
            return;
        }

        const response = await fetch("http://localhost:8070/api/clauses/user-clauses", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch lease clauses");
        }

        const data = await response.json();

        // ✅ Extract and safely parse `clauseText`
        const clauseTexts = data
            .filter(agreement => agreement.clauseText) // Ensure `clauseText` exists
            .map(agreement => {
                try {
                    return JSON.parse(agreement.clauseText); // Parse JSON safely
                } catch (error) {
                    console.error("Invalid JSON in clauseText:", agreement.clauseText);
                    return []; // Return empty array if parsing fails
                }
            });

        // ✅ Flatten the array (since `clauseText` is an array inside an array)
        const flatClauses = clauseTexts.flat();

        console.log("Fetched Clause Texts:", flatClauses);
        return flatClauses; // Return cleaned-up clauses

    } catch (error) {
        console.error("Error fetching lease clauses:", error);
    }
};



  const handleAgreementChange = (event) => {
    const selectedId = event.target.value;
    const agreement = leaseAgreements.find(agreement => agreement.id === Number(selectedId));
    setSelectedAgreement(agreement);
  };

  //selected
  console.log(selectedAgreement);
  // Signature 1
  const startDrawing1 = (e) => {
    const canvas = canvasRef1.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    setIsDrawing1(true);
    setLastX1(e.clientX - rect.left);
    setLastY1(e.clientY - rect.top);
  };

  const draw1 = (e) => {
    if (!isDrawing1) return;
    const canvas = canvasRef1.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(lastX1, lastY1);
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
    setLastX1(e.clientX - rect.left);
    setLastY1(e.clientY - rect.top);
  };

  const stopDrawing1 = () => {
    setIsDrawing1(false);
  };

  const clearSignature1 = () => {
    const canvas = canvasRef1.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureDataUrl1(null);
  };

  const saveSignature1 = () => {
    const canvas = canvasRef1.current;
    if (!canvas) return;
    const dataURL = canvas.toDataURL('image/png');
    setSignatureDataUrl1(dataURL);
  };

  // Signature 2
  const startDrawing2 = (e) => {
    const canvas = canvasRef2.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    setIsDrawing2(true);
    setLastX2(e.clientX - rect.left);
    setLastY2(e.clientY - rect.top);
  };

  const draw2 = (e) => {
    if (!isDrawing2) return;
    const canvas = canvasRef2.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(lastX2, lastY2);
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
    setLastX2(e.clientX - rect.left);
    setLastY2(e.clientY - rect.top);
  };

  const stopDrawing2 = () => {
    setIsDrawing2(false);
  };

  const clearSignature2 = () => {
    const canvas = canvasRef2.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureDataUrl2(null);
  };

  const saveSignature2 = () => {
    const canvas = canvasRef2.current;
    if (!canvas) return;
    const dataURL = canvas.toDataURL('image/png');
    setSignatureDataUrl2(dataURL);
  };
  
  const generatePDF = async () => {
    if (!selectedAgreement) {
      alert("Please select a lease agreement.");
      return;
    }
  
    const doc = new jsPDF();
    doc.setFont("helvetica");
  
    let yOffset = 20; // Initial vertical position
    const pageHeight = doc.internal.pageSize.height - 20;
    const lineHeight = 10;
  
    const addPage = () => {
      doc.addPage();
      yOffset = 20;
      doc.rect(5, 5, doc.internal.pageSize.width - 10, doc.internal.pageSize.height - 10); // Border
    };

    // 🖼️ **Add PNG Image (Company Logo or Any Image)**
    const img = new Image();
    
    if (selectedAgreement.propertyLocation == "Tamil Nadu") {
      img.src = "/image/header.png"; // **Ensure this image is in your public folder**
    } else {
      img.src = "/image/100.png"; // **Ensure this image is in your public folder**
    }
    await new Promise((resolve) => {
        img.onload = () => {
          const pageWidth = doc.internal.pageSize.width;
          const imgWidth = 150; // Set desired width
          const imgHeight = 70; // Set desired height
          const xPos = (pageWidth - imgWidth) / 2; // Center the image
          doc.addImage(img, "PNG", xPos, yOffset, imgWidth, imgHeight);
          yOffset += imgHeight + 10;
            resolve();
        };
    });

    yOffset += 10; // Move down after image
  
    // Title
    doc.setFontSize(20);
    const title = "Rental Agreement";
    const titleWidth = doc.getTextWidth(title);
    const pageWidth = doc.internal.pageSize.width;
    doc.text(title, (pageWidth - titleWidth) / 2, yOffset); // Centering the title
    yOffset += 15;
  
    // Border
    doc.rect(5, 5, doc.internal.pageSize.width - 10, doc.internal.pageSize.height - 10);
  
    // User Details
    doc.setFontSize(12);
    const userDetails = [
      `Tenant: ${selectedAgreement.user.username || "N/A"}`,
      `Landlord: ${selectedAgreement.landlordName || "N/A"}`,
      `Property: ${selectedAgreement.landlordAddress || "N/A"}`,
      `Lease Term: ${selectedAgreement.leaseStartDate|| "N/A"} - ${selectedAgreement.leaseEndDate || "N/A"}`,
      `Monthly Rent: Rs.${selectedAgreement.rentAmount || "50000"}`,
    ];
  
    userDetails.forEach((detail) => {
      if (yOffset + lineHeight > pageHeight) addPage();
      doc.text(detail, 10, yOffset);
      yOffset += lineHeight;
    });
  
    yOffset += 10; // Space before clauses
  
    // Standard Clauses
    doc.setFontSize(14);
    if (yOffset + 15 > pageHeight) addPage();
    doc.text("Standard Rental Agreement Clauses:", 10, yOffset);
    yOffset += lineHeight;
    doc.setFontSize(10);
  
    const standardClauses = [
      "1. The tenant agrees to pay rent on time.",
      "2. The landlord is responsible for major repairs.",
      "3. No illegal activities are allowed on the premises.",
      "4. The tenant must provide 30-day notice before moving out."
    ];
  
    standardClauses.forEach((clause) => {
      if (yOffset + lineHeight > pageHeight) addPage();
      doc.text(clause, 10, yOffset);
      yOffset += lineHeight;
    });
  
    yOffset += 10; // Space before additional clauses
  
    // Additional Clauses (Dynamic)
    doc.setFontSize(14);
    if (yOffset + 15 > pageHeight) addPage();
    doc.text("Additional Clauses:", 10, yOffset);
    yOffset += lineHeight;
    doc.setFontSize(10);
  
    const userClauses = Array.isArray(leaseClauses) ? leaseClauses.flat() : [];
    if (userClauses.length > 0) {
      userClauses.forEach((clause, index) => {
        if (yOffset + lineHeight > pageHeight) addPage();
        const clauseLines = doc.splitTextToSize(`${index + 1}. ${clause.generated_text || "Invalid clause format"}`, 180);
        clauseLines.forEach((line) => {
          if (yOffset + lineHeight > pageHeight) addPage();
          doc.text(line, 10, yOffset);
          yOffset += lineHeight;
        });
        yOffset += 5; // Extra spacing after each clause
      });
    } else {
      if (yOffset + lineHeight > pageHeight) addPage();
      doc.text("No additional clauses provided.", 10, yOffset);
      yOffset += lineHeight;
    }
  
    yOffset += 15; // Extra space before Lease Renewal (FIX)
  
    // **Ensure Lease Renewal Starts on a New Line**
    if (yOffset + 20 > pageHeight) addPage();
    doc.setFontSize(14);
    doc.text("Lease Renewal Option:", 10, yOffset);
    yOffset += lineHeight;
    doc.setFontSize(10);
  
    const leaseRenewalText = leaseRenewalOption || "No option specified";
    const leaseRenewalLines = doc.splitTextToSize(leaseRenewalText, 180);
    
    leaseRenewalLines.forEach((line) => {
      if (yOffset + lineHeight > pageHeight) addPage();
      doc.text(line, 10, yOffset);
      yOffset += lineHeight;
    });
  
    yOffset += 20; // Space before E-Signatures (Ensures No Overlap)
  
    // Ensure Signatures are on a New Page if Needed
    if (yOffset + 60 > pageHeight) addPage();
  
    // E-Signatures Section
    doc.setFontSize(14);
    doc.text("E-Signatures:", 10, yOffset);
    yOffset += 10;
  
    // Client Signature
    if (signatureDataUrl1) {
      const signature1 = await html2canvas(canvasRef1.current);
      const signature1Img = signature1.toDataURL("image/png");
  
      doc.addImage(signature1Img, "PNG", 10, yOffset, 50, 20);
      doc.text("Client Signature", 10, yOffset + 25);
    } else {
      doc.text("Client Signature: Not Provided", 10, yOffset);
    }
  
    // Owner Signature (Placing it Next to Client Signature)
    if (signatureDataUrl2) {
      const signature2 = await html2canvas(canvasRef2.current);
      const signature2Img = signature2.toDataURL("image/png");
  
      doc.addImage(signature2Img, "PNG", 100, yOffset, 50, 20);
      doc.text("Owner Signature", 100, yOffset + 25);
    } else {
      doc.text("Owner Signature: Not Provided", 100, yOffset);
    }
  
    yOffset += 40; // Move down after signatures
  
    // Save PDF
    doc.save("Lease_Agreement.pdf");
  };
  
  

  return (
    <div className="final-details-download-container">
      <div className="final-details-section">
        <h2>Final Details</h2>
        <div className="lease-renewal">
          <h3>Lease Renewal</h3>
          <p>Will the tenant have the option to renew the lease?</p>
          <div className="renewal-options">
            <button className="renewal-button" onClick={() => handleLeaseRenewalChange('No option specified')}>No option specified</button>
            <button className="renewal-button" onClick={() => handleLeaseRenewalChange('Yes, revise standard clause')}>Yes, revise standard clause</button>
            <button className="renewal-button" onClick={() => handleLeaseRenewalChange('Yes, same terms')}>Yes, same terms</button>
          </div>
        </div>
        {/* Dropdown to Select Agreement */}
<div className="select-container">
  <label>Select Lease Agreement:</label>
  <select onChange={handleAgreementChange} value={selectedAgreement ? selectedAgreement.id : ""}>
    <option value="">Select Agreement</option>
    {leaseAgreements.map(agreement => (
      <option key={agreement.id} value={agreement.id}>
        {agreement.title ? agreement.title : `Lease ${agreement.id}`} - {agreement.landlordName || "No Name"}
      </option>
    ))}
  </select>
</div>

        <div className="e-signature-container">
          <div className="e-signature" style={{display:'flex'}}>
            <div style={{marginRight:'250px'}}>
              <h3>Client</h3>
              <canvas
                ref={canvasRef1}
                id="signature-pad-1"
                width={400}
                height={200}
                style={{ border: '2px dashed black', cursor: 'crosshair' }}
                onMouseDown={startDrawing1}
                onMouseMove={draw1}
                onMouseUp={stopDrawing1}
                onMouseOut={stopDrawing1}
              />
              <div id="controls-1" style={{ marginTop: '10px' }}>
                <button id="clear-button-1" onClick={clearSignature1}>Clear</button>
                <button id="save-button-1" onClick={saveSignature1}>Save</button>
              </div>
              {signatureDataUrl1 && <img id="signature-image-1" src={signatureDataUrl1} alt="Signature 1" style={{ marginTop: '20px', maxWidth: '100%' }} />}
            </div>
            <div>
              <h3>Owner</h3>
              <canvas
                ref={canvasRef2}
                id="signature-pad-2"
                width={400}
                height={200}
                style={{ border: '2px dashed black', cursor: 'crosshair' }}
                onMouseDown={startDrawing2}
                onMouseMove={draw2}
                onMouseUp={stopDrawing2}
                onMouseOut={stopDrawing2}
              />
              <div id="controls-2" style={{ marginTop: '10px' }}>
                <button id="clear-button-2" onClick={clearSignature2}>Clear</button>
                <button id="save-button-2" onClick={saveSignature2}>Save</button>
              </div>
              {signatureDataUrl2 && <img id="signature-image-2" src={signatureDataUrl2} alt="Signature 2" style={{ marginTop: '10px', maxWidth: '100%' }} />}
            </div>
          </div>
        </div>
      </div>

      <div className="download-section">
        <h2>Download</h2>
        <div className="leased-property">
          <h3>Leased Property</h3>
          <p>To download your Rental Agreement, click download button</p>
          <div className="download-button-container">
            <button className="download-button" onClick={generatePDF}>Download</button>
          </div>
        </div>
      </div>

      <div className="about-us-section">
        <h2>About us</h2>
        <div className="about-content">
          <div className="legal-docs-info">
            <img src="/image/legalshield.png" className="legal-docs-logo"  />
            <b className="logo-text">Legal Shield</b>
            <p>We are passionate about creating and reviewing legal documents using AI technology.</p>
          </div>
          <div className="contact-info">
            <h3>Email & ph-no</h3>
            <p>support@legaldocs.com</p>
            <p>9499954629</p>
            <p>(Mon to Fri, From 10am to 6pm)</p>
          </div>
          <div className="social-media">
            <h3>Social Media</h3>
            <p>Follow up on social media to find out the latest updates.</p>
            <div className="social-icons">
              <a href="https://www.instagram.com/dhanushh15/" className="social-icon">
                <InstagramIcon />
              </a>
              <a href="#" className="social-icon">
                <FacebookOutlined />
              </a>
              <a href="#" className="social-icon">
                <Twitter />
              </a>
              <a href="#" className="social-icon">
                <LinkedIn/>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer">
        <div className="footer-links">
          <a href="#">Privacy Policy</a> <a href="#">Terms and Conditions</a>
        </div>
        <div className="copyright">
          Copyright 2025 by Legaldocs.com. All Rights Reserved
        </div>
      </div>
    </div>
  );
}

export default FinalDetailsDownload;