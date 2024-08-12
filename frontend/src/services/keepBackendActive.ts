import { loginAndSaveToken } from "./login";

setInterval(() => {
    loginAndSaveToken(
        'none',
        'none',
        () => console.log('Requested to backend'),
        false
    );
}, 300000); // Every 5 minutes