import * as ls from '../utils/localStorage';

const saveDataReponseStatusCodes = [200, 201];
const logoutReponseStatusCodes = [401, 422];

export function handleFetchResponse(
    response: any,
    onDone: any,
    saveDataFunction: any = () => 'none',
    flashes: any = {},
    text: boolean = false
) {
    const responsePromise = text ? response.text() : response.json();

    responsePromise.then((data: any) => {
        if (saveDataReponseStatusCodes.includes(response.status)) {
            data = text ? data : JSON.stringify(data);
            saveDataFunction(data);
        } else if (logoutReponseStatusCodes.includes(response.status)) {
            ls.clearAll();
            window.location.href = '/login';
        }
        if (!ls.getFlash()) {
            const flash = flashes[response.status.toString()];
            ls.setFlash(flash ? flash : '');
        }
        onDone();
    })
}