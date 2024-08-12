import React from "react";

import UpdateObjectPage from "./UpdateObjectPage";

import { getCrismandos, getEncontros } from "../utils/localStorage";
import { getEncontrosData } from "../services/getData";
import { updateEncontro } from "../services/updateObject";
import { formatISODate } from "../utils/format";
import { getEncontroFrequency } from "../services/getFrequency";
import { updateEncontroFrequency } from "../services/updateFrequency";
import { deleteEncontro } from "../services/deleteObject";

export default function UpdateEncontro() {
    function getFrequencyList() {
        let crismandos = getCrismandos();
        return {
            'frequenciaencontro': crismandos ? JSON.parse(crismandos) : {}
        }
    }
    return (
        <UpdateObjectPage
            title={"Encontro"}
            returnToUrl='/encontros'
            propertyName='encontro'
            getNonLocalDataFunction={getEncontrosData}
            getLocalDataFunction={getEncontros}
            getLocalObjectFreq={() => {}}
            fetchObjectFreqFunction={getEncontroFrequency}
            getFrequencyListsFunction={getFrequencyList}
            updateObjectFreqFunction={updateEncontroFrequency}
            deleteObjectFunction={deleteEncontro}
            freqDataOptions={{
                "frequenciaencontro": {
                    listName: "Crismandos",
                    refAttr: "nome",
                    freqRefName: "crismando"
                },
            }}
            updateObjectFunction={(token: any, id: any, object:any, onDone: any) => updateEncontro(
                token,
                id,
                object.tema.trim(),
                formatISODate(object.data),
                onDone
            )}
            fields={[{
                    type: 'text',
                    label: 'Tema',
                    name: 'tema',
                    placeholder: 'Ex: O cristão de hoje'
                },
                {
                    type: 'date',
                    label: 'Data',
                    name: 'data'
                }
            ]}
        />
    )
}