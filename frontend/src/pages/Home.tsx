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
import { getFreq } from "../utils/localStorage";

export default function Home() {
    const token = useToken().token;
    const setFlashMessage = useFlashMessage().setFlashMessage;
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [encontroTable, setEncontroTable] = useState<any[]>([]);
    //const [domingoTable, setDomingoTable] = useState([]);

    function mountFrequencyTable() {
        const data: any[] = [];
        const localData = getFreq();
        if (!localData) {
            return setEncontroTable([]);
        }

        

        for (let encontro of Object.values(localData)) {

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
                    {data}
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
            setIsLoading(false);
            setFlashMessage(getFlashMessage());
        })
    }


    return (
        <Page>
            {token ? <Navigate to='/crismandos' replace/> : <></>}
            <form onSubmit={handleSubmit} action='/'>
                <h1> Minha frequência </h1>
                <Loading active={isLoading} />
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
                    
            {encontroTable}
            
        </Page>
    )
}