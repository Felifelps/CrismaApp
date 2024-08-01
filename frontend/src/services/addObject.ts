
import * as ls from "../utils/localStorage";
import { apiUrl } from "../utils/constants";

function addObject(
        url: string,
        token: any,
        objectData: any,
        onDone: any
    ) {
    let responseStatus = 0;
    fetch(apiUrl + url, {
        method: 'POST',
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
