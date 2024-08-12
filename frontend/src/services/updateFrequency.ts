import { apiUrl } from "../utils/constants";
import { handleFetchResponse } from "./handleFetchResponse";
import { UpdateFreqData } from "../utils/manageLocalData";

function updateObjectFrequency(
        baseUrl: string,
        token: any,
        objectId: any,
        frequencyList: any,
        onDone: any
    ) {
    fetch(apiUrl + baseUrl + objectId + '/freq', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(frequencyList)
    }).then(response => {
        handleFetchResponse(
            response,
            onDone,
            (data: any) => UpdateFreqData(
                data,
                baseUrl.slice(1, baseUrl.length - 2),
                objectId
            )
        );
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
