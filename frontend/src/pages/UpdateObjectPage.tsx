import React, {useState} from "react";

import { useParams } from "react-router-dom";

import '../assets/styles/Form.css'

import Loading from "../components/Loading";

import { AdminOnlyPage } from "./Page";

import { useToken } from "../contexts/Token";
import { useFlashMessage } from "../contexts/FlashMessages";

import { formatISODate, formatDate } from "../utils/format";
import { ensureAllDataIsLocal } from "../services/getData";
import { getFlashMessage } from "../utils/getFlashMessages";
import { getFreq } from "../utils/localStorage";

interface ObjectType {
    [key: string]: string | number | undefined; // ou outros tipos conforme necessário
}

interface FreqSimpleList {
    id: string | number,
    justified: boolean
}

export default function UpdateObjectPage(props: any) {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingFreq, setIsLoadingFreq] = useState(true);
    const [object, setObject] = useState<ObjectType>({});
    const [frequencyTable, setFrequencyTable] = useState([]);
    const [frequencyData, setFrequencyData] = useState<ObjectType>({});
    const token = useToken().token;
    const setFlashMessage = useFlashMessage().setFlashMessage;

    function updateObject(field: string, value: any) {
        setObject(prevObject => ({
            ...prevObject,
            [field]: value, // Atualiza o valor do campo específico
        }));
    }

    function updateFreqData(field: string, value: any) {
        setFrequencyData(prevData => ({
            ...prevData,
            [field]: value
        }));
    }

    function getDefaultValue(name: string, type: string) {
        const value = object[name];
        if (type === 'date' && typeof value === 'string' && value.trim() !== '') {
            return formatISODate(value);
        }
        return value || '';
    }

    function redirectAndReload () {
        setIsLoading(false);
        setFlashMessage(getFlashMessage());
        //window.location.href = props.returnToUrl;
    }

    function formatFrequencyData() {
        const formattedData: any = {};
        for (let key of Object.keys(frequencyData)) {
            const [group, refObjId] = key.split('-')
            if (!(Object.keys(formattedData).includes(group))) {
                formattedData[group] = [];
            }
            const value = frequencyData[key];
            if (value !== 0) {
                formattedData[group].push({
                    [props.propertyName]: id,
                    [props.freqDataOptions[group].freqRefName]: refObjId,
                    justificado: value === 1
                })
            }
        }
        console.log(formattedData)
        return formattedData;
    }

    function handleOnSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (isLoading) {
            return;
        }
        setIsLoading(true);

        props.updateObjectFunction(token, id, object, redirectAndReload);
        props.updateObjectFreqFunction(token, id, formatFrequencyData(), redirectAndReload);
    }

    function handleDeleteOnClick(e: any) {
        e.preventDefault();
        if (isLoading) {
            return;
        }
        setIsLoading(true);
        props.deleteObjectFunction(token, id, redirectAndReload);
    }

    function serveFrequency() {
        function finish() {
            setFrequencyTable(finalData);
            setFrequencyData(frequencyDataMount);
            setIsLoadingFreq(false);
        }
        
        const finalData: any = [<p>Nenhum dado encontrado :(</p>];
        const frequencyDataMount: any = {};
        const freq = getFreq();

        if (!freq) return finish();

        finalData.pop();

        const frequencyLists = props.getFrequencyListsFunction();

        const objectFreq = freq ? JSON.parse(freq) : {};
        for (let listName in frequencyLists) {
            const freqRefName = props.freqDataOptions[listName].freqRefName;
            const refAttr = props.freqDataOptions[listName].refAttr;
            const list = frequencyLists[listName];

            const objectFreqList: FreqSimpleList[] = [];
            const values: any[] = Object.values(objectFreq[listName]); 
            for (let i = 0; i < values.length; i ++) {
                let value = values[i];
                if (value[props.propertyName].toString() !== id) {
                    continue
                }
                objectFreqList.push({
                    id: value[freqRefName],
                    justified: value.justificado
                })
            };

            let data = [];
            for (let objId in list) {
                const objReference = list[objId][refAttr];
                const freq = objectFreqList.find((item) => item.id.toString() === objId) || { justified: false };

                const missed = !objectFreqList.some((item) => item.id.toString() === objId);
                const participated = !missed && !freq.justified;
                const justified = !missed && freq.justified;

                const groupName = `${listName}-${objId}`;
                frequencyDataMount[groupName] = missed ? 0 : (justified ? 1 : 2)

                data.push(
                    <tr key={objId}>
                        <td>{formatDate(objReference)}</td>
                        {[missed, justified, participated].map((value, index) => (
                            <td key={index}>
                                <input
                                    type="radio"
                                    name={groupName}
                                    defaultChecked={value}
                                    value={index}  // 0 = missed, 1 = justified, 2 = participated
                                    onChange={() => updateFreqData(groupName, index)}
                                />
                            </td>
                        ))}
                    </tr>
                );
            }

            finalData.push(
                <div key={listName}>  
                    <h2>{props.freqDataOptions[listName].listName}</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>{refAttr.charAt(0).toUpperCase() + refAttr.slice(1)}</th>
                                <th>F</th>
                                <th>J</th>
                                <th>P</th>
                            </tr>
                        </thead>
                        <tbody>{data}</tbody>
                    </table>
                </div>
            );
        }
        finish();
    }

    function serveData() {
        const localData = JSON.parse(props.getLocalDataFunction());
        for (let obj in localData) {
            if (obj === id) {
                setObject(localData[id])
            }
        }
        setIsLoading(false);
        if (isLoadingFreq) {
            props.fetchObjectFreqFunction(token, id, serveFrequency);
        }
    }

    if (isLoading && Object.keys(object).length === 0) {
        ensureAllDataIsLocal(token, serveData);
    }

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

                <Loading active={isLoadingFreq} />
                {frequencyTable}

                <div className='buttons-container'>
                    <input
                        className="button safe"
                        type='submit'
                        value={isLoading ? 'Alterando...' : 'Alterar'}
                    />
                    <button className="button danger" onClick={handleDeleteOnClick}>
                        Excluir registro
                    </button>
                </div>
            </form>
        </AdminOnlyPage>
    )
}