import { VarNameBase } from "./constants";

const localStorageHandler = (varName: string) => {
    varName = VarNameBase + varName;
    return {
        get: () => localStorage.getItem(varName),
        set: (value: any) => localStorage.setItem(varName, value),
        remove: () => localStorage.removeItem(varName)
    }
};

export const clearAll = () => localStorage.clear();

export const { get: getToken, set: setToken, remove: removeToken } = localStorageHandler("AuthToken");
export const { get: getCrismandos, set: setCrismandos, remove: removeCrismandos } = localStorageHandler("Crismandos");
export const { get: getEncontros, set: setEncontros, remove: removeEncontros } = localStorageHandler("Encontros");
export const { get: getDomingos, set: setDomingos, remove: removeDomingos } = localStorageHandler("Domingos");
export const { get: getFreq, set: setFreq, remove: removeFreq } = localStorageHandler("Freq");
export const { get: getFlash, set: setFlash, remove: removeFlash } = localStorageHandler("Flash");