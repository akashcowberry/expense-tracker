// components/DebugToken.jsx
import React from 'react';

const DebugToken = () => {
    const checkToken = () => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        console.log('Current token:', token);
        console.log('Current user:', user);
        alert(`Token: ${token}\nUser: ${user}`);
    };

    const clearToken = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        console.log('Token cleared');
        alert('Token cleared');
    };

    return (
        <div style={{ padding: '20px', border: '1px solid red', margin: '10px' }}>
            <h3>Debug Token Info</h3>
            <button onClick={checkToken}>Check Token</button>
            <button onClick={clearToken}>Clear Token</button>
        </div>
    );
};

export default DebugToken;