import { apiUrl } from "../utils/constants";
import { setFreq } from "../utils/localStorage";
import { handleFetchResponse } from "./handleFetchResponse";

function getObjectFrequency(
        baseUrl: string,
        token: any,
        objectId: any,
        onDone: any
    ) {
    fetch(apiUrl + baseUrl + objectId + '/freq', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(response => {
        handleFetchResponse(response, onDone, setFreq);
    });
}

export const getCrismandoFrequency = (
    token: any,
    id: any,
    onDone: any
) => getObjectFrequency(
    '/crismandos/',
    token,
    id,
    onDone
)

export const getEncontroFrequency = (
    token: any,
    id: any,
    onDone: any
) => getObjectFrequency(
    '/encontros/',
    token,
    id,
    onDone
)

export const getDomingoFrequency = (
    token: any,
    id: any,
    onDone: any
) => getObjectFrequency(
    '/domingos/',
    token,
    id,
    onDone
)
