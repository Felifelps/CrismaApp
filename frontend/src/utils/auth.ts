
const isLoggedName = 'CrismaApp.isLogged';

export const getIsLogged = () => {
    return localStorage.getItem(isLoggedName)
}

export const setIsLogged = (value: any) => {
    if (!value) {
        return localStorage.removeItem(isLoggedName)
    }
    return localStorage.setItem(isLoggedName, value);
}