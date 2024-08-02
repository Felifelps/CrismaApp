import React, {useState} from "react";

import { useParams } from "react-router-dom";

import '../assets/styles/Form.css'

import Loading from "../components/Loading";

import { AdminOnlyPage } from "./Page";

import { useToken } from "../contexts/Token";

import { formatISODate } from "../utils/format";
import { ensureAllDataIsLocal } from "../services/getData";
import { removeCrismandos, removeDomingos, removeEncontros } from "../utils/localStorage";

interface ObjectType {
    [key: string]: string | number | undefined; // ou outros tipos conforme necessário
}

export default function UpdateObjectPage(props: any) {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [object, setObject] = useState<ObjectType>({});
    const [frequencyObjects, setfrequencyObjects] = useState([]);
    const token = useToken().token;

    const updateLoading = () => setIsLoading((value) => !value);

    function updateObject(field: string, value: any) {
        setObject(prevObject => ({
            ...prevObject,
            [field]: value, // Atualiza o valor do campo específico
        })); // Não refletirá a atualização imediata; use `prevObject` no lugar
    }

    function getDefaultValue(name: string, type: string) {
        const value = object[name];
        if (type === 'date' && typeof value === 'string' && value.trim() !== '') {
            return formatISODate(value)
        }
        return value;
    }

    function redirectAndReload () {
        removeCrismandos();
        removeEncontros();
        removeDomingos();
        updateLoading();
        window.location.href = props.returnToUrl;
    }

    function handleOnSubmit(e: React.FormEvent) {
        e.preventDefault();
        updateLoading();
        props.updateObjectFunction(token, id, object, redirectAndReload);
    }

    function serveData() {
        const localData = JSON.parse(props.getLocalDataFunction());
        for (let obj in localData) {
            if (obj === id) {
                setObject(localData[id])
            }
        }
    }

    function serveFrequency() {
        const data: any = [];
        const frequencyLists = props.getFrequencyListsFunction();
        const objectFrequencyList = props.getLocalObjectFreq();
        for (let listName in frequencyLists) {
            const list = frequencyLists[listName]
            data.push((<h2>{props.freqDataOptions[listName].listName}</h2>))
            for (let objId in list) {
                const objReference = list[objId][props.freqDataOptions[listName].refAttr]
                const participated = objId in objectFrequencyList && !objectFrequencyList[objId].justificado;
                const justified = objId in objectFrequencyList && objectFrequencyList[objId].justificado;
                const missed = !(objId in objectFrequencyList);
                data.push((
                    <>
                        <p> {objReference} </p>
                        <p> P: {participated}</p>
                        <p> J: {justified}</p>
                        <p> F: {missed}</p>
                    </>
                ));
            }
        }
        setfrequencyObjects(data);
        updateLoading();
    }

    if (isLoading && Object.keys(object).length === 0) {
        ensureAllDataIsLocal(token, serveData);
        props.fetchObjectFreqFunction(token, id, serveFrequency);
    }
    
    /*{props.frequencyElementsFunction(data)}*/
    return (
        <AdminOnlyPage>
            <h1> Editar {props.title} </h1>
            <Loading active={isLoading} />
            <form onSubmit={handleOnSubmit}>
                {props.fields.map((field: any, index: number) => (
                    <div key={index} className='form-group'>
                        <label> {field.label}: </label>
                        <input
                            type={field.type}
                            onChange={(e: any) => updateObject(
                                field.name,
                                e.target.value
                            )}
                            defaultValue={getDefaultValue(field.name, field.type)}
                            placeholder={field.placeholder}
                            required
                        />
                    </div>
                ))}
                <Loading active={isLoading} />
                {frequencyObjects.map((value: any) => (<p>{value}</p>))}
                <div className='buttons-container'>
                    <button className="button danger">
                        Excluir registro
                    </button>
                    <input
                        className="button safe"
                        type='submit'
                        value={isLoading ? 'Alterando...' : 'Alterar'}
                    />
                </div>
            </form>
        </AdminOnlyPage>
    )
}