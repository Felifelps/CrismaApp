import { apiUrl } from "../utils/constants";
import * as ls from '../utils/localStorage';
import { updateObjectOnData } from "../utils/manageLocalData";
import { handleFetchResponse } from "./handleFetchResponse";
import * as getObject from "./getObject";

function updateObject(
        url: string,
        token: any,
        objectId: any,
        objectData: any,
        onDone: any,
        getDataFunc: any,
        setDataFunc: any,
        getObjectDataFunc: any
    ) {
    fetch(apiUrl + url + objectId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(objectData)
    }).then(response => {
        if (response.status === 200) {
            updateObjectOnData(
                objectId,
                getDataFunc,
                setDataFunc,
                (callbackFunc: any) => getObjectDataFunc(
                    token,
                    objectId,
                    onDone,
                    callbackFunc
                )
            )
        }
        handleFetchResponse(
            response,
            () => null, // the real callback is loaded on getObjectDataFunc
            (data: any) => null,
            {
                '200': 'Atualizado com sucesso!:1',
                '400': 'Informações inválidas:0'
            }
        );
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
    onDone,
    ls.getCrismandos,
    ls.setCrismandos,
    getObject.getCrismando
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
    onDone,
    ls.getEncontros,
    ls.setEncontros,
    getObject.getEncontro
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
    onDone,
    ls.getDomingos,
    ls.setDomingos,
    getObject.getDomingo
)
