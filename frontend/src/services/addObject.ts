import { apiUrl } from "../utils/constants";
import { handleFetchResponse } from "./handleFetchResponse";

function addObject(
        url: string,
        token: any,
        objectData: any,
        onDone: any
    ) {
    fetch(apiUrl + url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(objectData)
    }).then(response => {
        handleFetchResponse(response, onDone);
    });

}

export const addCrismando = (
    token: any,
    name: string,
    dataNasc: string,
    telefone: string,
    onDone: any
) => addObject(
    '/crismandos/',
    token,
    {nome: name, data_nasc: dataNasc, telefone: telefone},
    onDone
)

export const addEncontro = (
    token: any,
    tema: string,
    data: string,
    onDone: any
) => addObject(
    '/encontros/',
    token,
    {tema: tema, data: data},
    onDone
)

export const addDomingo = (
    token: any,
    data: string,
    onDone: any
) => addObject(
    '/domingos/',
    token,
    {data: data},
    onDone
)
