import React from "react";

import UpdateObjectPage from "./UpdateObjectPage";

import { getEncontros, getDomingos, getCrismandos, removeCrismandos, getCurrentObjFreq } from "../utils/localStorage";
import { getEncontrosData, getDomingosData, getCrismandosData } from "../services/getData";
import { updateCrismando } from "../services/updateObject";
import { formatISODate } from "../utils/format";
import { getCrismandoFrequency } from "../services/getFrequency";

export default function UpdateCrismando() {
    

    function getFrequencyData () {
        let encData = getEncontros();
        let domData = getDomingos();
        return {
            "frequenciaencontro": encData ? JSON.parse(encData) : {},
            "frequenciadomingo": domData = domData ? JSON.parse(domData) : {}
        };
    }

    return (
        <UpdateObjectPage
            title={"Crismando"}
            returnToUrl='/crismandos'
            getNonLocalDataFunction={getCrismandosData}
            getLocalDataFunction={getCrismandos}
            getLocalObjectFreq={getCurrentObjFreq}
            fetchObjectFreqFunction={getCrismandoFrequency}
            getFrequencyListsFunction={getFrequencyData}
            freqDataOptions={{
                "frequenciaencontro": {
                    listName: "Encontros",
                    refAttr: "tema"
                },
                "frequenciadomingo": {
                    listName: "Domingos",
                    refAttr: "data"
                },
            }}
            updateObjectFunction={(token: any, id: any, object:any, onDone: any) => updateCrismando(
                token,
                id,
                object.nome.trim(),
                formatISODate(object.data_nasc),
                object.telefone.trim(),
                onDone
            )}
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