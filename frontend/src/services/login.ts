import * as ls from "../utils/localStorage";
import { apiUrl } from "../utils/constants";
import { handleFetchResponse } from "./handleFetchResponse";

export function loginAndSaveToken(
        username: any,
        password: any,
        onDone: any = () => console.log('Data got')
    ) {
    fetch(apiUrl + '/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username.trim(),
            password: password.trim()
        })
    }).then(response => {
        handleFetchResponse(response, onDone, (stringData: any) => ls.setToken(
            JSON.parse(stringData).token
        ));
    })
}
