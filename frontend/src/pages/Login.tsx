import React, { useState } from "react";
import { Navigate } from "react-router-dom";

import '../assets/styles/Pages.css';
import '../assets/styles/Form.css';

import Page from "./Page";
import Loading from "../components/Loading";
import FlashMessage from "../components/FlashMessage";

import { getToken } from "../utils/localStorage";

import { useToken } from "../contexts/Token";
import { useFlashMessage } from "../contexts/FlashMessages";
import { loginAndSaveToken } from "../services/login";
import { getFlashMessage } from "../utils/getFlashMessages";

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setshowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const {token, setToken} = useToken();
    const setFlashMessage = useFlashMessage().setFlashMessage;

    function onLoginDone() {
        setToken(getToken() || '');
        setFlashMessage(getFlashMessage());
        setIsLoading(false);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (isLoading) {
            return;
        }
        setIsLoading(true);
        loginAndSaveToken(username.trim(), password.trim(), onLoginDone);
    }

    return (
        <Page>
            {token && <Navigate to='/crismandos' replace/>}
            <form onSubmit={handleSubmit} action='/crismandos'>
                <h1>Login</h1>
                
                <FlashMessage/>

                <p> 
                    Esta área é destinada aos administradores do sistema. Caso deseje ver sua frequência, 
                    siga as instruções disponibilizadas <a href='/' style={{textDecoration: 'underline'}}>
                        neste link
                    </a>.
                </p>
                

                <Loading active={isLoading}/>
                
                <label>Username: </label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    placeholder="Ex: fulaninho123"
                    onChange={(e) =>{
                        setUsername(e.target.value)
                    }}
                    required
                />

                <label>Password: </label>
                <div className="input-group">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        placeholder="Ex: senhasegura123"
                        value={password}
                        onChange={(e) =>{
                            setPassword(e.target.value)
                        }}
                        required
                    />
                    <span
                        id="icon"
                        className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        onClick={() => {
                            setshowPassword((value) => !value)
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