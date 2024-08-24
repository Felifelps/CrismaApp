import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

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
    const navigate = useNavigate();
    const tableRef = useRef<HTMLTableElement>(null);

    const handleDownload = async () => {
        if (tableRef.current) {
            // Captura a tela do elemento da tabela
            const canvas = await html2canvas(tableRef.current);
            // Converte o canvas em um blob
            canvas.toBlob((blob) => {
                if (blob) {
                // Salva o blob como um arquivo de imagem
                saveAs(blob, 'screenshot.png');
            }
        });
        }
    };

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
                <i
                    className="fa-solid fa-plus icon"
                    onClick={() => navigate(props.newFormPath)}
                >
                </i>
                <i
                    className="fa-solid fa-database icon" 
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
                >
                </i>
                <i
                    className="fa-solid fa-rotate icon"
                    onClick={() => {
                        setIsLoading(true);
                        props.deleteLocalDataFunc();
                        props.getNonLocalDataFunc(token, serveData);
                    }}
                >
                </i>
                <i
                    className="fa-solid fa-image icon"
                    onClick={handleDownload}
                >
                </i>
            </h1>
            <FlashMessage/>
            <Loading active={isLoading}/>
            <div className='table-container' style={{"display": tableDisplay}}>
                <table ref={tableRef}>
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