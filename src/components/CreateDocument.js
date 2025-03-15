import React, { useState, useRef } from 'react';
import './CreateDocument.css';

function CreateDocument() {
    const [location, setLocation] = useState('');
    const [landlordName, setLandlordName] = useState('');
    const [landlordAddress, setLandlordAddress] = useState('');
    const [landlordPhone, setLandlordPhone] = useState('');
    const [userName, setUserName] = useState('');
    const [userAddress, setUserAddress] = useState('');
    const [signatureDataUrl, setSignatureDataUrl] = useState(null);
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastX, setLastX] = useState(0);
    const [lastY, setLastY] = useState(0);

    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        setIsDrawing(true);
        setLastX(e.clientX - rect.left);
        setLastY(e.clientY - rect.top);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();
        setLastX(e.clientX - rect.left);
        setLastY(e.clientY - rect.top);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const saveSignature = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dataURL = canvas.toDataURL('image/png');
        setSignatureDataUrl(dataURL);
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setSignatureDataUrl(null);
    };

    const handleDownload = () => {
        const docContent = `
            Location: ${location}
            Landlord Name: ${landlordName}
            Landlord Address: ${landlordAddress}
            Landlord Phone: ${landlordPhone}
            User Name: ${userName}
            User Address: ${userAddress}
            Signature: ${signatureDataUrl ? 'Signed' : 'Not Signed'}
        `;

        const blob = new Blob([docContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'property_contract.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="create-document-container">
            <h2>Create Property Contract</h2>
            <form>
                <div>
                    <label>Location:</label>
                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
                </div>
                <div>
                    <label>Landlord Name:</label>
                    <input type="text" value={landlordName} onChange={(e) => setLandlordName(e.target.value)} required />
                </div>
                <div>
                    <label>Landlord Address:</label>
                    <input type="text" value={landlordAddress} onChange={(e) => setLandlordAddress(e.target.value)} required />
                </div>
                <div>
                    <label>Landlord Phone:</label>
                    <input type="tel" value={landlordPhone} onChange={(e) => setLandlordPhone(e.target.value)} required />
                </div>
                <div>
                    <label>User Name:</label>
                    <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} required />
                </div>
                <div>
                    <label>User Address:</label>
                    <input type="text" value={userAddress} onChange={(e) => setUserAddress(e.target.value)} required />
                </div>
            </form>

            <h3>Signature</h3>
            <canvas
                ref={canvasRef}
                width={400}
                height={200}
                style={{ border: '1px solid black', cursor: 'crosshair' }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
            />
            <div>
                <button onClick={clearSignature}>Clear Signature</button>
                <button onClick={saveSignature}>Save Signature</button>
            </div>
            {signatureDataUrl && <img src={signatureDataUrl} alt="Signature" style={{ marginTop: '10px', maxWidth: '100%' }} />}

            <button onClick={handleDownload}>Download Contract</button>
        </div>
    );
}

export default CreateDocument;