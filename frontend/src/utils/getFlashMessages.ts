import { getFlash, removeFlash } from "./localStorage";


export const getFlashMessage = () => {
    const data = getFlash()?.split(':');
    const type: 'success' | 'error' = data && data[1] === '1' ? 'success' : 'error'
    removeFlash();
    return {
        message: data ? data[0] : '',
        type: type
    }
}