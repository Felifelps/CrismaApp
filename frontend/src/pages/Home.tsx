import React from "react";
import { Navigate } from "react-router-dom";

import '../assets/styles/Pages.css'

import Page from "./Page";

import { useToken } from "../contexts/Token";

export default function Home() {
    const token = useToken().token;
    return (
        <Page>
            {token ? <Navigate to='/crismandos' replace/> : <></>}
            <h1>Home Page</h1>
            <p>{token}</p>
        </Page>
    )
}