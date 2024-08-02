import * as ls from "../utils/localStorage";
import { apiUrl } from "../utils/constants";

export function loginAndSaveToken(
        username: any,
        password: any,
        onDone: any = () => console.log('Data got'),
        saveResponse: boolean = true
    ) {
    let responseStatus = 0;
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
        responseStatus = response.status;
        return response.json();
    }).then(data => {
        if (responseStatus === 200) {
            ls.setToken(data.token);
        }
        if (saveResponse) {
            ls.setMessage(responseStatus.toString());
        }
        onDone();
    });
}
