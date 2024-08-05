import { loginAndSaveToken } from "./login";

setInterval(() => {
    loginAndSaveToken(
        'none',
        'none',
        () => console.log('Requested to backend')
    );
}, 300000);