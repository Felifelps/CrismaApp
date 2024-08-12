import { apiUrl } from "../utils/constants";
import * as ls from '../utils/localStorage';
import { deleteObjectFromData } from "../utils/manageLocalData";
import { handleFetchResponse } from "./handleFetchResponse";

function deleteObject(
        url: string,
        token: any,
        objectId: any,
        onDone: any,
        getDataFunc: any,
        setDataFunc: any
    ) {
    fetch(apiUrl + url + objectId, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(response => {
        handleFetchResponse(
            response,
            onDone,
            (data: any) => deleteObjectFromData(
                objectId,
                getDataFunc,
                setDataFunc
            )
        );
    });
}

export const deleteCrismando = (
    token: any,
    id: any,
    onDone: any,
) => deleteObject(
    '/crismandos/',
    token,
    id,
    onDone,
    ls.getCrismandos,
    ls.setCrismandos
)

export const deleteEncontro = (
    token: any,
    id: any,
    onDone: any
) => deleteObject(
    '/encontros/',
    token,
    id,
    onDone,
    ls.getEncontros,
    ls.setEncontros
)

export const deleteDomingo = (
    token: any,
    id: any,
    onDone: any
) => deleteObject(
    '/domingos/',
    token,
    id,
    onDone,
    ls.getDomingos,
    ls.setDomingos
)
