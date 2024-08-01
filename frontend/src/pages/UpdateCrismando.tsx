import React, {useState} from "react";
import { Link } from "react-router-dom";



import NewObjectPage from "./NewObjectPage";

import { getEncontros, getDomingos } from "../utils/localStorage";
import { getEncontrosData, getDomingosData } from "../services/getData";

export default function NewCrismando() {
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
        <NewObjectPage
            title={"Crismando"}
            getDataFunction={getBothData}
            getLocalDataFunction={getFrequencyData}
            frequencyElementsFunction={createFrequencyElements}
            fields={[{
                    type: 'text',
                    onChange: (e: any) => setName(e.target.value),
                    label: 'Nome'
                },
                {
                    type: 'date',
                    onChange: (e: any) => setDate(e.target.value),
                    label: 'Data de nascimento'
                },
                {
                    type: 'phone',
                    onChange: (e: any) => setTel(e.target.value),
                    label: 'Número'
                },
            ]}
        />
    )
}