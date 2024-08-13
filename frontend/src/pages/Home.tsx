import { useState } from "react";

import { Navigate } from "react-router-dom";

import '../assets/styles/Pages.css'

import Page from "./Page";

import { useToken } from "../contexts/Token";
import { useFlashMessage } from "../contexts/FlashMessages";

import FlashMessage from "../components/FlashMessage";
import { getFlashMessage } from "../utils/getFlashMessages";
import { getFrequencyByName } from "../services/getFrequencyByName";

export default function Home() {
    const token = useToken().token;
    const setFlashMessage = useFlashMessage().setFlashMessage;
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [frequencyTable, setFrequencyTable] = useState([])

    function handleSubmit(e: any) {
        e.preventDefault();
        if (isLoading) {
            return;
        }
        setIsLoading(true);
        getFrequencyByName(name, () => {
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
            {frequencyTable}
        </Page>
    )
}