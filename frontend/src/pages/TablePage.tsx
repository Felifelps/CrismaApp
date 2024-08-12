import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import '../assets/styles/Table.css'

import { AdminOnlyPage } from "./Page";

import Loading from "../components/Loading";
import FlashMessage from "../components/FlashMessage";

import { useToken } from "../contexts/Token";
import { useFlashMessage } from "../contexts/FlashMessages";

import { getFlashMessage } from "../utils/getFlashMessages";
import { downloadData } from "../services/downloadData";

export function TablePage(props: any) {
    const token = useToken().token;
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState({});
    const tableDisplay = isLoading ? "none" : "block";
    const setFlashMessage = useFlashMessage().setFlashMessage;

    const serveData = () => {
        setFlashMessage(getFlashMessage());
        const localData = props.getLocalDataFunc();
        setData(JSON.parse(localData));
        setIsLoading(false);
    }

    // useEffect para carregar os dados apenas uma vez quando o componente é montado
    useEffect(() => {
        if (isLoading) {
            props.getNonLocalDataFunc(token, serveData);
        }
    }, []); // O array vazio [] garante que o efeito rode apenas uma vez após o primeiro render

    return (
        <AdminOnlyPage>
            <h1>
                {props.title}
                <Link to={props.newFormPath}> + </Link>
                <i
                    onClick={() => {
                        setIsLoading(true);
                        downloadData(
                            props.newFormPath.replace('/new', ''),
                            token,
                            () => {
                                setIsLoading(false);
                                setFlashMessage(getFlashMessage());
                            }
                        )
                    }}
                    style={{cursor: 'pointer'}}
                    className="fa-solid fa-database" 
                >
                </i>
            </h1>
            <FlashMessage/>
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