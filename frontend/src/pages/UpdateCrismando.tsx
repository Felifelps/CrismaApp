import React, {useState} from "react";
import { Link } from "react-router-dom";

import UpdateObjectPage from "./UpdateObjectPage";

import { getEncontros, getDomingos, getCrismandos, removeCrismandos } from "../utils/localStorage";
import { getEncontrosData, getDomingosData, getCrismandosData } from "../services/getData";
import { updateCrismando } from "../services/updateObject";
import { formatISODate } from "../utils/format";

export default function UpdateCrismando() {
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
            updateObjectFunction={(token: any, id: any, object:any, onDone: any) => updateCrismando(
                token,
                id,
                object.nome.trim(),
                formatISODate(object.data_nasc),
                object.telefone.trim(),
                onDone
            )}
            clear
            frequencyElementsFunction={createFrequencyElements}
            fields={[{
                    type: 'text',
                    label: 'Nome',
                    name: 'nome',
                    placeholder: 'Ex: Fulano da Silva'
                },
                {
                    type: 'date',
                    label: 'Data de nascimento',
                    name: 'data_nasc'
                },
                {
                    type: 'phone',
                    label: 'Número',
                    name: 'telefone',
                    placeholder: 'Ex: 88 940028922'
                },
            ]}
        />
    )
}