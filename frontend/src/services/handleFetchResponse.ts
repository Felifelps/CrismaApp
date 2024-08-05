import * as ls from '../utils/localStorage';

const logoutReponseStatusCodes = [401, 422];

export function handleFetchResponse(
    response: any,
    onDone: any,
    saveDataFunction: any = () => 'none',
) {
    response.json().then((data: any) => {
        console.log(response.status);
        if (response.status === 200) {
            saveDataFunction(JSON.stringify(data));
        } else if (logoutReponseStatusCodes.includes(response.status)) {
            ls.removeToken();
            window.location.href = '/login';
        }

        ls.setMessage(`${response.status.toString()} : ${data.message}`);
        onDone();
    })
}