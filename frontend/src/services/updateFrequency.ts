
import * as ls from "../utils/localStorage";
import { apiUrl } from "../utils/constants";

function updateObjectFrequency(
        baseUrl: string,
        token: any,
        objectId: any,
        frequencyList: any,
        onDone: any
    ) {
    let responseStatus = 0;
    fetch(apiUrl + baseUrl + objectId + '/freq', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(frequencyList)
    }).then(response => {
        responseStatus = response.status;
        return response.json();
    }).then(data => {
        ls.setMessage(`${responseStatus.toString()} : ${data.message}`);
        onDone();
    });

}

export const updateCrismandoFrequency = (
    token: any,
    id: any,
    frequencyList: any,
    onDone: any
) => updateObjectFrequency(
    '/crismandos/',
    token,
    id,
    frequencyList,
    onDone
)

export const updateEncontroFrequency = (
    token: any,
    id: any,
    frequencyList: any,
    onDone: any
) => updateObjectFrequency(
    '/encontros/',
    token,
    id,
    frequencyList,
    onDone
)

export const updateDomingoFrequency = (
    token: any,
    id: any,
    frequencyList: any,
    onDone: any
) => updateObjectFrequency(
    '/domingos/',
    token,
    id,
    frequencyList,
    onDone
)
