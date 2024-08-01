import React, {useState} from "react";
import { Link } from "react-router-dom";

import '../assets/styles/Table.css'

import { AdminOnlyPage } from "./Page";

import Loading from "../components/Loading";

import { useToken } from "../contexts/Token";

export function TablePage(props: any) {
    const token = useToken().token;
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState({});
    const tableDisplay = isLoading ? "none" : "block";

    const updateLoading = () => setIsLoading((value) => !value);

    const serveData = () => {
        const localData = props.getLocalDataFunc();
        setData(JSON.parse(localData));
        updateLoading();
    }

    if (isLoading) {
        props.getNonLocalDataFunc(token, serveData);
    }

    return (
        <AdminOnlyPage>
            <h1> {props.title} <Link to={props.newFormPath}> + </Link></h1>
            <Loading active={isLoading}/>
            <div className='table-container' style={{"display": tableDisplay}}>
                <table>
                    <thead>
                        <tr>
                            {props.fields.map(((field: string, index: number) => (
                                <th key={index}> {field} </th>
                            )))}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(data).sort(props.sortingFunction).map(props.mappingFunction)}
                    </tbody>
                </table>
            </div>
        </AdminOnlyPage>
    )
}