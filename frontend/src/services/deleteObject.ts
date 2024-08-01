
import * as ls from "../utils/localStorage";
import { apiUrl } from "../utils/constants";

function deleteObject(
        url: string,
        token: any,
        objectId: any,
        onDone: any
    ) {
    let responseStatus = 0;
    fetch(apiUrl + url + objectId, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(response => {
        responseStatus = response.status;
        return response.json();
    }).then(data => {
        ls.setMessage(`${responseStatus.toString()} : ${data.message}`);
        onDone();
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
