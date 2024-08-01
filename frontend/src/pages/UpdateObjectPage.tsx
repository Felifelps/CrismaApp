import React, {useState} from "react";

import { useParams, Navigate } from "react-router-dom";

import '../assets/styles/Form.css'

import Loading from "../components/Loading";

import { AdminOnlyPage } from "./Page";

import { useToken } from "../contexts/Token";

import { formatISODate } from "../utils/format";

export default function UpdateObjectPage(props: any) {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [object, setObject] = useState({});
    const token = useToken().token;

    const updateLoading = () => setIsLoading((value) => !value);

    function getObjectValue(obj: any, name: string, type: string): any {
        for (let field in obj) {
            if (field === name) {
                return type === 'date' ? formatISODate(obj[field]) : obj[field];
            }
        }
        return '';
    }

    function redirectAndReload () {
        props.removeLocalDataFunction();
        updateLoading();
        window.location.href = props.returnToUrl;
    }

    function handleOnSubmit(e: React.FormEvent) {
        e.preventDefault();
        props.updateObjectFunction(token, id, redirectAndReload);
    }

    const serveData = () => {
        const localData = JSON.parse(props.getLocalDataFunction());
        for (let obj in localData) {
            if (obj === id) {
                setObject(localData[id])
            }
        }
        updateLoading();
    }

    if (isLoading) {
        props.getNonLocalDataFunction(token, serveData)
    }
    
    /*{props.frequencyElementsFunction(data)}*/
    return (
        <AdminOnlyPage>
            <h1> Editar {props.title} </h1>
            <form onSubmit={handleOnSubmit}>
                {props.fields.map((field: any, index: number) => (
                    <div key={index} className='form-group'>
                        <label> {field.label}: </label>
                        <input
                            type={field.type}
                            onChange={field.onChange}
                            defaultValue={getObjectValue(object, field.name, field.type)}
                            placeholder={field.placeholder}
                            required
                        />
                    </div>
                ))}
                <Loading active={isLoading} />
                <input
                    type='submit'
                    value='Registrar'
                />
            </form>
        </AdminOnlyPage>
    )
}