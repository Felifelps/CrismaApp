
import * as ls from "../utils/localStorage";
import { apiUrl } from "../utils/constants";

function getAllData(
        url: string,
        token: any,
        getLocalFunc: any,
        savingLocalFunc: any,
        onDone: any = () => console.log('Data got')
    ) {
    const localData = getLocalFunc();
    if (localData) {
        return onDone();
    }
    let responseStatus = 0;
    fetch(apiUrl + url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    }).then(response => {
        responseStatus = response.status;
        return response.json();
    }).then(data => {
        if (responseStatus === 200) {
            savingLocalFunc(JSON.stringify(data));
        }
        ls.setMessage(responseStatus.toString());
        onDone();
    });

}

export const getCrismandosData = (
    token: any,
    onDone: any = () => console.log('Got crismandos data')
) => getAllData(
    '/crismandos/',
    token,
    ls.getCrismandos,
    ls.setCrismandos,
    onDone
)

export const getEncontrosData = (
    token: any,
    onDone: any = () => console.log('Got encontros data')
) => getAllData(
    '/encontros/',
    token,
    ls.getEncontros,
    ls.setEncontros,
    onDone
)

export const getDomingosData = (
    token: any,
    onDone: any = () => console.log('Got domingos data')
) => getAllData(
    '/domingos/',
    token,
    ls.getDomingos,
    ls.setDomingos,
    onDone
)