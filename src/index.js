import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App';
import LeaseForm from './components/leaseform';

import CostsClauses from './components/CostsClauses';
import FinalDetailsDownload from './components/FinalDetailsDownload';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <LeaseForm/>
    <CostsClauses/>
    <FinalDetailsDownload/>
  </React.StrictMode>
);

