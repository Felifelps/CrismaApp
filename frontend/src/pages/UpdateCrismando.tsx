import React, {useState} from "react";
import { Link } from "react-router-dom";

import UpdateObjectPage from "./UpdateObjectPage";

import { getEncontros, getDomingos, getCrismandos, removeCrismandos } from "../utils/localStorage";
import { getEncontrosData, getDomingosData, getCrismandosData } from "../services/getData";
import { updateCrismando } from "../services/updateObject";
import { formatISODate } from "../utils/format";

export default function UpdateCrismando() {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [tel, setTel] = useState('');

    let domDone = false;
    let encDone = false; 
    const partialOnDone = (dom: any, enc: any, onDone: any) => {
        domDone = dom ? dom : domDone;
        encDone = enc ? enc : encDone;
        if (domDone && encDone) {
            console.log('Two done');
            onDone();
        }
    }

    function getBothData(token: any, onDone: any) {
        getEncontrosData(token, () => partialOnDone(false, true, onDone))
        getDomingosData(token, () => partialOnDone(true, false, onDone))
    }

    function getFrequencyData () {
        let encData = getEncontros();
        let domData = getDomingos();
        return {
            "Encontros": encData ? JSON.parse(encData) : {},
            "Domingos": domData = domData ? JSON.parse(domData) : {}
        };
    }

    function createFrequencyElements (data: any) {
        let elements = [];
        for (let title in data) {
            elements.push(<h2>{title}</h2>);
            elements.push((
                <table>
                    <thead>

                    </thead>
                    <tbody>
                        {Object.values(data[title]).map((object: any) => (
                            <p>a</p>
                        ))}
                    </tbody>
                </table>
            ))
            
        }
        return elements;
    }

    return (
        <UpdateObjectPage
            title={"Crismando"}
            returnToUrl='/crismandos'
            getNonLocalDataFunction={getCrismandosData}
            getLocalDataFunction={getCrismandos}
            removeLocalDataFunction={removeCrismandos}
            updateObjectFunction={(token: any, id: any, onDone: any) => updateCrismando(
                token,
                id,
                name,
                date,
                tel,
                onDone
            )}
            clear
            frequencyElementsFunction={createFrequencyElements}
            fields={[{
                    type: 'text',
                    onChange: (e: any) => setName(e.target.value),
                    label: 'Nome',
                    name: 'nome',
                    placeholder: 'Ex: Fulano da Silva'
                },
                {
                    type: 'date',
                    onChange: (e: any) => setDate(e.target.value),
                    label: 'Data de nascimento',
                    name: 'data_nasc'
                },
                {
                    type: 'phone',
                    onChange: (e: any) => setTel(e.target.value),
                    label: 'Número',
                    name: 'telefone',
                    placeholder: 'Ex: 88 940028922'
                },
            ]}
        />
    )
}