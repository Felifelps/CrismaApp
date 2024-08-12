import { apiUrl } from "../utils/constants";
import { handleFetchResponse } from "./handleFetchResponse";

export function getObjectStats(
        url: string,
        token: any,
        objectId: any,
        savingData: any
    ) {
    fetch(apiUrl + url + objectId + '/stats', {
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

export const getCrismandoStats = (
    token: any,
    id: any,
    savingFunc: any
) => getObjectStats(
    '/crismandos/',
    token,
    id,
    savingFunc
)

export const getEncontroStats = (
    token: any,
    id: any,
    savingFunc: any
) => getObjectStats(
    '/encontros/',
    token,
    id,
    savingFunc
)

export const getDomingoStats = (
    token: any,
    id: any,
    savingFunc: any
) => getObjectStats(
    '/domingos/',
    token,
    id,
    savingFunc
)
