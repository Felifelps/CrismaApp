import { apiUrl } from "../utils/constants";
import * as ls from '../utils/localStorage';
import { updateObjectOnData } from "../utils/manageLocalData";
import { handleFetchResponse } from "./handleFetchResponse";
import * as stats from "./getObjectStats";

function updateObject(
        url: string,
        token: any,
        objectId: any,
        objectData: any,
        onDone: any,
        getDataFunc: any,
        setDataFunc: any,
        statsFunc: any
    ) {
    fetch(apiUrl + url + objectId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(objectData)
    }).then(response => {
        handleFetchResponse(
            response,
            onDone,
            (data: any) => updateObjectOnData(
                objectId,
                objectData,
                getDataFunc,
                setDataFunc,
                (savingFunc: any) => console.log('In') !== statsFunc(token, objectId, savingFunc)
            ),
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
    stats.getCrismandoStats
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
    stats.getEncontroStats
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
    stats.getDomingoStats
)
