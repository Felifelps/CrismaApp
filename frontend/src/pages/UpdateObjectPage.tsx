import React, {useState} from "react";

import '../assets/styles/Form.css'

import Loading from "../components/Loading";

import { AdminOnlyPage } from "./Page";

import { useToken } from "../contexts/Token";

export default function UpdateObjectPage(props: any) {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState({});
    const token = useToken().token;

    const updateLoading = () => setIsLoading((value) => !value);

    function handleOnSubmit(e: React.FormEvent) {
        console.log(e.currentTarget.tagName);
    }

    const serveData = () => {
        const frequency = props.getLocalDataFunction();
        setData(frequency);
        updateLoading();
    }

    if (isLoading) {
        props.getDataFunction(token, serveData);
    }

    return (
        <AdminOnlyPage>
            <h1> Registrar {props.title} </h1>
            <form onSubmit={handleOnSubmit}>
                {props.fields.map((field: any, index: number) => (
                    <div key={index} className='form-group'>
                        <label> {field.label}: </label>
                        <input
                            type={field.type}
                            onChange={field.onChange}
                            required
                        />
                    </div>
                ))}
                <Loading active={isLoading} />
                {props.frequencyElementsFunction(data)}
                <input
                    type='submit'
                    value='Registrar'
                />
            </form>
        </AdminOnlyPage>
    )
}