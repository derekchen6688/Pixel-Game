import React, { useState } from 'react';

const LoginScreen = ({ onStart, errorMsg }) => {
    const [id, setId] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (id.trim() === '') {
            alert('PLEASE ENTER YOUR ID');
            return;
        }
        onStart(id.trim());
    };

    return (
        <div>
            <h1>PIXEL TRIVIA</h1>
            <h2>INSERT COIN... wait, just enter ID</h2>

            {errorMsg && <p className="error-msg">{errorMsg}</p>}

            <form onSubmit={handleSubmit} className="input-container">
                <input
                    type="text"
                    placeholder="PLAYER ID"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    maxLength={20}
                    autoComplete="off"
                />
                <br />
                <button type="submit">START GAME</button>
            </form>
        </div>
    );
};

export default LoginScreen;
