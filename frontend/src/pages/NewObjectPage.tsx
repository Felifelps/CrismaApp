import React, {useState} from "react";
import { Navigate } from "react-router-dom";

import '../assets/styles/Form.css'

import Loading from "../components/Loading";

import { AdminOnlyPage } from "./Page";

import { useToken } from "../contexts/Token";

export default function NewObjectPage(props: any) {
    const [isLoading, setIsLoading] = useState(false);
    const token = useToken().token;

    const updateLoading = () => setIsLoading((value) => !value);

    function redirectAndReload () {
        props.removeLocalDataFunction();
        updateLoading();
        window.location.href = props.returnToUrl;
    }

    function handleOnSubmit(e: React.FormEvent) {
        e.preventDefault();
        updateLoading();
        props.createObjectFunction(token, redirectAndReload);
    }

    return (
        <AdminOnlyPage>
            <h1> Registrar {props.title} </h1>
            <Loading active={isLoading} />
            <form onSubmit={handleOnSubmit}>
                {props.fields.map((field: any, index: number) => (
                    <div key={index} className='form-group'>
                        <label> {field.label}: </label>
                        <input
                            type={field.type}
                            onChange={field.onChange}
                            placeholder={field.placeholder}
                            required
                        />
                    </div>
                ))}
                <input
                    type='submit'
                    value='Registrar'
                />
            </form>
        </AdminOnlyPage>
    )
}