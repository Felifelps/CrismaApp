import { useState, useRef, useEffect } from "react";
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

import { Navigate } from "react-router-dom";

import '../assets/styles/Pages.css'

import Page from "./Page";

import { useToken } from "../contexts/Token";
import { useFlashMessage } from "../contexts/FlashMessages";

import FlashMessage from "../components/FlashMessage";
import Loading from "../components/Loading";

import { getFlashMessage } from "../utils/getFlashMessages";
import { getFrequencyByName } from "../services/getFrequencyByName";
import { getFreq, removeFreq } from "../utils/localStorage";
import { formatDate } from "../utils/format";


export default function Home() {
    const token = useToken().token;
    const setFlashMessage = useFlashMessage().setFlashMessage;
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [encontroTable, setEncontroTable] = useState<any[]>([]);
    const tableRef = useRef<HTMLTableElement>(null);

    async function handleDownload () {
        if (tableRef.current) {
            const canvas = await html2canvas(tableRef.current);
            canvas.toBlob((blob) => {
                if (blob) {
                    saveAs(blob, 'screenshot.png');
                }
            }
        );
        }
    };

    function renderFrequencyTable() {
        function frequencyIcon(value: any) {
            return <i className={'fa' + (value ? 's' : 'r') + ' fa-circle'}></i>
        }

        let localFreq: any = getFreq();
        if (!localFreq) {
            return setEncontroTable([]);
        }

        const encontrosRows: any[] = [];
        localFreq = JSON.parse(localFreq);

        let missed = 0;
        let justified = 0;
        let participated = 0;
        let total = 0;

        for (let encontro of localFreq['frequenciaencontro']) {
            total += 1;
            if (encontro.missed) missed += 1
            else {
                if (encontro.justified) justified += 1
                else participated += 1
            }

            encontrosRows.push(
                <tr key={encontro.tema + encontro.data}>
                    <td> {encontro.tema} </td>
                    <td> {formatDate(encontro.data)} </td>
                    <td> {frequencyIcon(encontro.missed)} </td>
                    <td> {frequencyIcon(encontro.justified)} </td>
                    <td> {frequencyIcon(!encontro.missed && !encontro.justified)} </td>
                </tr>
            )
        }

        setEncontroTable([
            <h2> 
                Encontros
                <i
                    className="fa-solid fa-image icon"
                    onClick={handleDownload}
                >
                </i>
            </h2>,
            <div>
                <p>   Presenças: {participated}
                <br/> Justificativas: {justified}
                <br/> Faltas: {missed}
                <br/> Total de encontros: {total} </p>
            </div>,
            <div className='table-container'>
                <table ref={tableRef}>
                    <thead>
                        <tr>
                            <th>Tema</th>
                            <th>Data</th>
                            <th>F</th>
                            <th>J</th>
                            <th>P</th>
                        </tr>
                    </thead>
                    <tbody>
                        {encontrosRows}
                    </tbody>
                </table>
            </div>
        ]);
    }

    function handleSubmit(e: any) {
        e.preventDefault();
        if (!isLoading) {
            setIsLoading(true);
            getFrequencyByName(name, () => {
                renderFrequencyTable();
                removeFreq();
                setIsLoading(false);
                setFlashMessage(getFlashMessage());
            })
        }
    }

    return (
        <Page>
            {token && <Navigate to='/crismandos' replace/>}
            <form onSubmit={handleSubmit} action='/'>
                <h1> Minha frequência </h1>
                
                <FlashMessage />
                
                <p>
                    Para ver sua frequência, digite seu nome completo no campo abaixo
                    (não esqueça os acentos).
                </p>
                
                <label>Nome: </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    placeholder="Ex: Fulano da Silva Medeiros"
                    onChange={(e) =>{
                        setName(e.target.value)
                    }}
                    required
                />
                <input
                    type='submit'
                    className='button'
                    value={isLoading ? 'Buscando...' : 'Buscar'}
                />
            </form>
                    
            {!isLoading ? encontroTable : null}
            
            <Loading active={isLoading} />
            
        </Page>
    )
}