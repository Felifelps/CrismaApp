import { apiUrl } from "../utils/constants";
import { handleFetchResponse } from "./handleFetchResponse";

export function getObject(
        url: string,
        token: any,
        objectId: any,
        onDone: any,
        savingData: any
    ) {
    fetch(apiUrl + url + objectId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(response => {
        handleFetchResponse(
            response,
            onDone,
            savingData,
        );
    });
}

export const getCrismando = (
    token: any,
    id: any,
    onDone: any,
    savingFunc: any
) => getObject(
    '/crismandos/',
    token,
    id,
    onDone,
    savingFunc
)

export const getEncontro = (
    token: any,
    id: any,
    onDone: any,
    savingFunc: any
) => getObject(
    '/encontros/',
    token,
    id,
    onDone,
    savingFunc
)

export const getDomingo = (
    token: any,
    id: any,
    onDone: any,
    savingFunc: any
) => getObject(
    '/domingos/',
    token,
    id,
    onDone,
    savingFunc
)
