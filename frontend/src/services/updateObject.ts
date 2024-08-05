import { apiUrl } from "../utils/constants";
import { handleFetchResponse } from "./handleFetchResponse";

function updateObject(
        url: string,
        token: any,
        objectId: any,
        objectData: any,
        onDone: any
    ) {
    fetch(apiUrl + url + objectId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(objectData)
    }).then(response => {
        handleFetchResponse(response, onDone);
    });
}

export const updateCrismando = (
    token: any,
    id: any,
    name: string,
    dataNasc: string,
    telefone: string,
    onDone: any
) => updateObject(
    '/crismandos/',
    token,
    id,
    {nome: name, data_nasc: dataNasc, telefone: telefone},
    onDone
)

export const updateEncontro = (
    token: any,
    id: any,
    tema: string,
    data: string,
    onDone: any
) => updateObject(
    '/encontros/',
    token,
    id,
    {tema: tema, data: data},
    onDone
)

export const updateDomingo = (
    token: any,
    id: any,
    data: string,
    onDone: any
) => updateObject(
    '/domingos/',
    token,
    id,
    {data: data},
    onDone
)
