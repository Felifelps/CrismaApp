import { useState, useRef } from "react";
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
    //const [domingoTable, setDomingoTable] = useState([]);
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

    function frequencyIcon(value: any) {
        return <i className={'fa' + (value ? 's' : 'r') + ' fa-circle'}></i>
    }

    function mountFrequencyTable() {
        const dataEncontros: any[] = [];
        let localData: any = getFreq();
        if (!localData) {
            return setEncontroTable([]);
        }
        localData = JSON.parse(localData);

        let missed = 0;
        let justified = 0;
        let participated = 0;
        let total = 0;

        for (let encontro of localData['frequenciaencontro']) {
            total += 1;
            if (encontro.missed) missed += 1
            else {
                if (encontro.justified) justified += 1
                else participated += 1
            }

            dataEncontros.push(
                <tr>
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
                        {dataEncontros}
                    </tbody>
                </table>
            </div>
        ]);
    }

    function handleSubmit(e: any) {
        e.preventDefault();
        if (isLoading) {
            return;
        }
        setIsLoading(true);
        getFrequencyByName(name, () => {
            mountFrequencyTable();
            removeFreq();
            setIsLoading(false);
            setFlashMessage(getFlashMessage());
        })
    }


    return (
        <Page>
            {token ? <Navigate to='/crismandos' replace/> : <></>}
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