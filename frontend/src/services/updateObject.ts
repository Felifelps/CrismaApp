
import * as ls from "../utils/localStorage";
import { apiUrl } from "../utils/constants";

function updateObject(
        url: string,
        token: any,
        objectId: any,
        objectData: any,
        onDone: any
    ) {
    let responseStatus = 0;
    fetch(apiUrl + url + objectId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(objectData)
    }).then(response => {
        responseStatus = response.status;
        return response.json();
    }).then(data => {
        ls.setMessage(`${responseStatus.toString()} : ${data.message}`);
        onDone();
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
