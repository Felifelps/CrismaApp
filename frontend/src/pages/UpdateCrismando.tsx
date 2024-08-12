import React from "react";

import UpdateObjectPage from "./UpdateObjectPage";

import { getEncontros, getDomingos, getCrismandos } from "../utils/localStorage";
import { getCrismandosData } from "../services/getData";
import { updateCrismando } from "../services/updateObject";
import { formatISODate } from "../utils/format";
import { getCrismandoFrequency } from "../services/getFrequency";
import { updateCrismandoFrequency } from "../services/updateFrequency";
import { deleteCrismando } from "../services/deleteObject";

export default function UpdateCrismando() {
    function getFrequencyData () {
        let encData = getEncontros();
        let domData = getDomingos();
        return {
            "frequenciaencontro": encData ? JSON.parse(encData) : {},
            "frequenciadomingo": domData ? JSON.parse(domData) : {}
        };
    }

    return (
        <UpdateObjectPage
            title={"Crismando"}
            returnToUrl='/crismandos'
            propertyName='crismando'
            getNonLocalDataFunction={getCrismandosData}
            getLocalDataFunction={getCrismandos}
            getLocalObjectFreq={() => {}}
            fetchObjectFreqFunction={getCrismandoFrequency}
            getFrequencyListsFunction={getFrequencyData}
            updateObjectFreqFunction={updateCrismandoFrequency}
            deleteObjectFunction={deleteCrismando}
            freqDataOptions={{
                "frequenciaencontro": {
                    listName: "Encontros",
                    refAttr: "tema",
                    freqRefName: "encontro"
                },
                "frequenciadomingo": {
                    listName: "Domingos",
                    refAttr: "data",
                    freqRefName: "domingo"
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