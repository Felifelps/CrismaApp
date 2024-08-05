
import * as ls from "../utils/localStorage";
import { apiUrl } from "../utils/constants";
import { handleFetchResponse } from "./handleFetchResponse";

function deleteObject(
        url: string,
        token: any,
        objectId: any,
        onDone: any
    ) {
    fetch(apiUrl + url + objectId, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(response => {
        handleFetchResponse(response, onDone);
    });
}

export const deleteCrismando = (
    token: any,
    id: any,
    onDone: any
) => deleteObject(
    '/crismandos/',
    token,
    id,
    onDone
)

export const deleteEncontro = (
    token: any,
    id: any,
    onDone: any
) => deleteObject(
    '/encontros/',
    token,
    id,
    onDone
)

export const deleteDomingo = (
    token: any,
    id: any,
    onDone: any
) => deleteObject(
    '/domingos/',
    token,
    id,
    onDone
)
