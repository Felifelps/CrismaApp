import { apiUrl } from "../utils/constants";
import { handleFetchResponse } from "./handleFetchResponse";

export function getObject(
        url: string,
        token: any,
        objectId: any,
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
            () => null,
            savingData,
        );
    });
}

export const getCrismando = (
    token: any,
    id: any,
    savingFunc: any
) => getObject(
    '/crismandos/',
    token,
    id,
    savingFunc
)

export const getEncontro = (
    token: any,
    id: any,
    savingFunc: any
) => getObject(
    '/encontros/',
    token,
    id,
    savingFunc
)

export const getDomingo = (
    token: any,
    id: any,
    savingFunc: any
) => getObject(
    '/domingos/',
    token,
    id,
    savingFunc
)
