import * as ls from "../utils/localStorage";
import { apiUrl } from "../utils/constants";
import { handleFetchResponse } from "./handleFetchResponse";

const loginFlashes = {
    '200': 'Logado com sucesso:1',
    '404': 'Usuário/senha incorreto:0',
    '403': 'Usuário/senha incorreto:0',
};

export function loginAndSaveToken(
        username: any,
        password: any,
        onDone: any = () => console.log('Data got'),
        flashes: boolean = true
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
        handleFetchResponse(
            response,
            onDone,
            (stringData: any) => ls.setToken(JSON.parse(stringData).token),
            flashes ? loginFlashes : {}
        );
    })
}
