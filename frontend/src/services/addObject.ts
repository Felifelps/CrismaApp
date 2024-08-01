
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
        ls.setMessage(`${responseStatus.toString()} : ${data.msg}`);
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
