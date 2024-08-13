import { useState } from "react";

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

export default function Home() {
    const token = useToken().token;
    const setFlashMessage = useFlashMessage().setFlashMessage;
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [encontroTable, setEncontroTable] = useState<any[]>([]);
    //const [domingoTable, setDomingoTable] = useState([]);

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

        for (let encontro of localData['frequenciaencontro']) {
            dataEncontros.push(
                <tr>
                    <td> {encontro.tema} </td>
                    <td> {frequencyIcon(encontro.missed)} </td>
                    <td> {frequencyIcon(encontro.justified)} </td>
                    <td> {frequencyIcon(!encontro.missed && !encontro.justified)} </td>
                </tr>
            )
        }

        setEncontroTable([
            <h2> Encontros </h2>,
            <table>
                <thead>
                    <tr>
                        <th>Tema</th>
                        <th>F</th>
                        <th>J</th>
                        <th>P</th>
                    </tr>
                </thead>
                <tbody>
                    {dataEncontros}
                </tbody>
            </table>
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