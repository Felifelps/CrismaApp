
import * as ls from "../utils/localStorage";
import { apiUrl } from "../utils/constants";

function getObjectFrequency(
        baseUrl: string,
        token: any,
        objectId: any,
        onDone: any
    ) {
    let responseStatus = 0;
    fetch(apiUrl + baseUrl + objectId + '/freq', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(response => {
        responseStatus = response.status;
        return response.json();
    }).then(data => {
        ls.setCurrentObjFreq(JSON.stringify(data));
        ls.setMessage(`${responseStatus.toString()} : ${data.message}`);
        onDone();
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
