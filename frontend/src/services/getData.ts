import * as ls from "../utils/localStorage";
import { apiUrl } from "../utils/constants";
import { handleFetchResponse } from "./handleFetchResponse";

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
    fetch(apiUrl + url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    }).then(response => {
        handleFetchResponse(
            response,
            onDone,
            savingLocalFunc,
            {
                '200': 'Dados carregados com sucesso:1'
            }
        );
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

export function ensureAllDataIsLocal(token: any, onDone: any) {
    let domDone = false;
    let crisDone = false;
    let encDone = false;
    const partialOnDone = (dom: any, enc: any, cris: any) => {
        domDone = dom ? dom : domDone;
        encDone = enc ? enc : encDone;
        crisDone = cris ? cris : crisDone;
        if (domDone && encDone && crisDone) {
            onDone();
        }
    }
    getCrismandosData(token, () => partialOnDone(false, false, true))
    getEncontrosData(token, () => partialOnDone(false, true, false))
    getDomingosData(token, () => partialOnDone(true, false, false))
}