import React, { useState } from "react";

import '../assets/styles/Pages.css';
import '../assets/styles/Form.css';

import Main from "../components/Main";

import { apiUrl } from "../utils/constants";

export default function Login() {
    const [username, setUsername] = useState(' ');
    const [password, setPassword] = useState(' ');
    const [iconOn, seticonOn] = useState(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        let responseStatus = 0;
        fetch(apiUrl + '/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username.trim(),
                password: password.trim()
            }),
        }).then(response => {
            responseStatus = response.status;
            return response.json();
        }).then(data => {
            if (responseStatus === 200) {
                console.log(data)
            }
        });
    }
    return (
        <Main>
            <form onSubmit={handleSubmit}>
                <h1>Login</h1>
                
                <label>Username: </label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) =>{
                        setUsername(e.target.value)
                    }}
                    required
                />
                    <label>Password: </label>
                <div className="input-group">
                    <input
                        type={iconOn ? 'text' : 'password'}
                        id="password"
                        value={password}
                        onChange={(e) =>{
                            setPassword(e.target.value)
                        }}
                        required
                    />
                    <span
                        id="icon"
                        className={iconOn ? 'fas fa-eye-slash' : 'fas fa-eye'}
                        onClick={() => {
                            seticonOn((value) => !value)
                        }}
                    ></span>
                </div>

                <input
                    type='submit'
                    value='Entrar'
                />

            </form>
        </Main>
    )
}