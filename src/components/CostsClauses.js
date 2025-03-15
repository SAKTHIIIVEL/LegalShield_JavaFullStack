import React, { useState } from 'react';
import './CostsClauses.css';


const CostsClauses = () => {
    const [contractId, setContractId] = useState(""); // Contract ID input
    const [prompt, setPrompt] = useState(""); // User input for AI prompt
    const [generatedClause, setGeneratedClause] = useState(""); // AI-generated clause
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGenerateClause = async () => {
        setLoading(true);
        setError(null);
        setGeneratedClause("");

        try {
            const token = localStorage.getItem("token"); // Get JWT token (Assuming it's stored)

            if (!contractId) {
                throw new Error("Contract ID is required.");
            }
            if (!prompt.trim()) {
                throw new Error("Prompt cannot be empty.");
            }

            const response = await fetch(`http://localhost:8070/api/clauses/generate/${contractId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ prompt }) // ✅ Send prompt in request body
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage || "Failed to generate clause.");
            }

            const data = await response.text();
            setGeneratedClause(data); // Update UI with AI-generated clause
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2>Generate Cost Clause</h2>

            {/* Input for Contract ID */}
            <input
                type="number"
                value={contractId}
                onChange={(e) => setContractId(e.target.value)}
                placeholder="Enter Contract ID"
                className="input-box"
            />

            {/* Input for Prompt */}
            <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter clause prompt"
                className="input-box"
            />

            {/* Button to Trigger API */}
            <button className="generate-btn" onClick={handleGenerateClause} disabled={loading}>
                {loading ? "Generating..." : "Generate Clause"}
            </button>

            {/* Display Error Message */}
            {error && <p className="error">{error}</p>}

            {/* Display AI Response */}
            {generatedClause && (
                <div className="clause-box">
                    <h3>Generated Clause:</h3>
                    <p>{generatedClause}</p>
                </div>
            )}
        </div>
    );
};

export default CostsClauses;
