// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import { setMockToken, getCurrentUser } from './backend_modules/services/UabsService.js';
//
// // Expose for console testing
// window.setMockToken   = setMockToken;
// window.getCurrentUser = getCurrentUser;
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { setMockToken } from './backend_modules/mockData/mockUsers.js';

// Set the mock token for the 'admin' user once at app start
// setMockToken('admin');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);



