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
    const [iconOn, seticonOn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const {token, setToken} = useToken();
    const setFlashMessage = useFlashMessage().setFlashMessage;

    function onLoginDone() {
        let localToken = getToken();
        setFlashMessage(getFlashMessage());
        setToken(localToken ? localToken : '');
        setIsLoading(false);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (isLoading) {
            return;
        }
        setIsLoading(true);
        loginAndSaveToken(username.trim(), password.trim(), onLoginDone)
    }

    return (
        <Page>
            {token ? <Navigate to='/crismandos' replace/>: <></>}
            <form onSubmit={handleSubmit} action='/crismandos'>
                <h1>Login</h1>
                
                <FlashMessage/>

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