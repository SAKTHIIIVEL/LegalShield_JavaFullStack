import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { text: 'Welcome to the Legal Document AI Chatbot!', sender: 'bot' },
  ]);
  const [userInput, setUserInput] = useState('');
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  
  // ✅ Check if user is logged in when component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginClick = () => {
    setShowLoginForm(true);
    setShowSignupForm(false);
  };

  const handleSignupClick = () => {
    setShowSignupForm(true);
    setShowLoginForm(false);
  };

  const handleCloseForm = () => {
    setShowLoginForm(false);
    setShowSignupForm(false);
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSendMessage = () => {
    const messageText = userInput.trim();
    if (messageText) {
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { text: messageText, sender: 'user' },
      ]);
      setUserInput('');
      getBotResponse(messageText);
    }
  };

  const getBotResponse = (message) => {
    const responses = {
      'hello': 'Hello! How can I help you?',
      'contract': "Sure, let's start generating your contract. What type of contract do you need?",
      'lease': 'Okay, a lease agreement. Please provide the property address and lease term.',
      'agreement': 'Please specify the type of agreement you need.',
      'default': "I'm still learning. Could you please be more specific?",
    };

    const lowerMessage = message.toLowerCase();
    let response = responses[lowerMessage] || responses['default'];

    setTimeout(() => {
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { text: response, sender: 'bot' },
      ]);
    }, 500);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('Uploaded file:', file);
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { text: `File uploaded: ${file.name}`, sender: 'user' },
      ]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  // ✅ User Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    const response = await fetch('http://localhost:8070/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token); // Store token
      setIsLoggedIn(true);
      setShowLoginForm(false);
      alert('Login successful!');
    } else {
      const errorMessage = await response.json();
      alert(errorMessage.error);
    }
  };

  // ✅ User Signup
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const username = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const role = e.target[4].value;

    const response = await fetch('http://localhost:8070/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, role }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      setShowSignupForm(false);
      alert('Registration successful!');
    } else {
      const errorMessage = await response.json();
      alert(errorMessage.error);
    }
  };

  // ✅ Logout Function
  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token
    setIsLoggedIn(false);
  };

  return (
    <div className="rental-guide-container">
      <header className="header">
        <div className="logo">
          <img src="/image/legalshield.png" alt="Legal Docs Logo" />
          <span className="logo-text">Legal Shield</span>
        </div>
        <nav className="nav">
          <a href="#">Home</a>
          <a href="contact.html">Contact Us</a>
          <a href="#" onClick={scrollToBottom}>About</a>
        </nav>
        <div className="btn">
          {isLoggedIn ? (
            <button className="login-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <>
              <button className="signup-btn" onClick={handleSignupClick}>
                Sign up
              </button>
              <button className="login-btn" onClick={handleLoginClick}>
                Login
              </button>
            </>
          )}
        </div>
      </header>

      <main className="main-content">
        <div className="image-container">
          <img src="/image/tvk.jpg" alt="House Keys" className="house-keys-image" />
        </div>
        <div className="text-content">
          <h1 className="title">A COMPLETE GUIDE TO RENTING OUT PROPERTY</h1>
          <p className="description">
            Finding success as a landlord starts with understanding your rights and obligations.
          </p>
          <div id="chat-container" ref={chatContainerRef}>
            <div id="chat-messages">
              {chatMessages.map((message, index) => (
                <div key={index} className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}>
                  {message.text}
                </div>
              ))}
            </div>
            <div id="input-container">
              <input
              id='user-input'
                type="text"
                placeholder="Type your message..."
                value={userInput}
                onChange={handleInputChange}
              />
              <button id='send-button' onClick={handleSendMessage}>Generate</button>
              <button id='upload-button' onClick={triggerFileInput}>+</button>
              <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />
            </div>
          </div>
        </div>
      </main>
      {showLoginForm && (
        <div className="form-container">
          <div className="form">
            <h2>Login</h2>
            <form onSubmit={handleLoginSubmit}>
              <input type="email" placeholder="Email" required />
              <input type="password" placeholder="Password" required />
              <button type="submit" className="submit-btn">
                Login
              </button>
            </form>
            <button className="close-btn" onClick={handleCloseForm}>
              Close
            </button>
          </div>
        </div>
      )}

      {showSignupForm && (
        <div className="form-container">
          <div className="form">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignupSubmit}>
              <input type="text" placeholder="Enter your name" required />
              <input type="email" placeholder="Email" required />
              <input type="password" placeholder="Password" required />
              <input type="password" placeholder="Confirm Password" required />
              {/* 🔽 Dropdown for selecting User Role */}
              <select required>
                <option value="">Select Role</option>
                <option value="TENANT">Tenant</option>
                <option value="LANDLORD">Landlord</option>
                <option value="ADMIN">Admin</option>
              </select>
              <button type="submit" className="submit-btn">
                Sign Up
              </button>
            </form>
            <button className="close-btn" onClick={handleCloseForm}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
