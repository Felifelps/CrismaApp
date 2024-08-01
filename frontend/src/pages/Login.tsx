import React, { useState } from "react";
import { Navigate } from "react-router-dom";

import '../assets/styles/Pages.css';
import '../assets/styles/Form.css';

import Page from "./Page";
import Loading from "../components/Loading";

import { apiUrl } from "../utils/constants";
import { setToken as setLocalToken} from "../utils/localStorage";

import { useToken } from "../contexts/Token";

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [iconOn, seticonOn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const {token, setToken} = useToken();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (isLoading) {
            return;
        }

        setIsLoading((value) => !value);

        let responseStatus = 0;

        fetch(apiUrl + '/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username.trim(),
                password: password.trim()
            })
        }).then(response => {
            responseStatus = response.status;
            return response.json();
        }).then(data => {
            if (responseStatus === 200) {
                setToken(data.token);
                setLocalToken(data.token);
            }
            setIsLoading((value) => !value);
        });
    }

    return (
        <Page>
            {token ? <Navigate to='/crismandos' replace/>: <></>}

            <form onSubmit={handleSubmit} action='/crismandos'>
                <h1>Login</h1>

                <Loading active={isLoading}/>
                
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
                    className='button'
                    value={isLoading ? 'Entrando...' : 'Entrar'}
                />
            </form>
        </Page>
    )
}