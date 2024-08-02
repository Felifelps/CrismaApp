import { VarNameBase } from "./constants";

const localStorageHandler = (varName: string) => ({
    get: () => localStorage.getItem(varName),
    set: (value: any) => localStorage.setItem(varName, value),
    remove: () => localStorage.removeItem(varName)
});

export const clearAll = () => localStorage.clear();

export const { get: getToken, set: setToken, remove: removeToken } = localStorageHandler(VarNameBase + "AuthToken");
export const { get: getCrismandos, set: setCrismandos, remove: removeCrismandos } = localStorageHandler(VarNameBase + "Crismandos");
export const { get: getEncontros, set: setEncontros, remove: removeEncontros } = localStorageHandler(VarNameBase + "Encontros");
export const { get: getDomingos, set: setDomingos, remove: removeDomingos } = localStorageHandler(VarNameBase + "Domingos");
export const { get: getMessage, set: setMessage, remove: removeMessage } = localStorageHandler(VarNameBase + "Message");
export const { get: getCurrentObjFreq, set: setCurrentObjFreq, remove: removeCurrentObjFreq } = localStorageHandler(VarNameBase + "CurrentObjFreq");
