import React, {useState} from "react";

import '../assets/styles/Form.css'

import Loading from "../components/Loading";

import { AdminOnlyPage } from "./Page";

import { useToken } from "../contexts/Token";

export default function NewObjectPage(props: any) {
    const [isLoading, setIsLoading] = useState(false);
    const token = useToken().token;

    function redirectAndReload () {
        props.removeLocalDataFunction();
        setIsLoading(false);
        window.location.href = props.returnToUrl;
    }

    function handleOnSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (isLoading) {
            return;
        }
        setIsLoading(true);
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
                    className='button'
                    type='submit'
                    value='Registrar'
                />
            </form>
        </AdminOnlyPage>
    )
}