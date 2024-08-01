import React, {useState} from "react";
import { Link } from "react-router-dom";

import UpdateObjectPage from "./UpdateObjectPage";

import { getEncontros, removeEncontros } from "../utils/localStorage";
import { getDomingosData, getEncontrosData } from "../services/getData";
import { updateEncontro } from "../services/updateObject";
import { formatISODate } from "../utils/format";

export default function UpdateEncontro() {
    return (
        <UpdateObjectPage
            title={"Encontro"}
            returnToUrl='/Encontros'
            getNonLocalDataFunction={getEncontrosData}
            getLocalDataFunction={getEncontros}
            removeLocalDataFunction={removeEncontros}
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