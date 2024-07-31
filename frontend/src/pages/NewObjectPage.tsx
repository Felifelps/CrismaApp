import React, {useState} from "react";
import { Link } from "react-router-dom";

import '../assets/styles/Form.css'

import { AdminOnlyPage } from "./Page";

export function NewObjectPage(props: any) {
    function handleOnSubmit(e: React.FormEvent) {
        e.preventDefault();
    }

    return (
        <AdminOnlyPage>
            <h1> Registrar {props.title} </h1>
            <form onSubmit={handleOnSubmit}>
            </form>
        </AdminOnlyPage>
    )
}