const emptyFrequencyData = {
    frequenciadomingo: {
        justified: 0,
        justify_rate: 0,
        miss_rate: 0,
        missed: 0,
        participated: 0,
        participation_rate: 0,
        total: 0,
    },
    frequenciaencontro: {
        justified: 0,
        justify_rate: 0,
        miss_rate: 0,
        missed: 0,
        participated: 0,
        participation_rate: 0,
        total: 0,
    }
}

export function addObjectIntoData(object: any, getDataFunc: any, saveDataFunc: any) {
    let data = getDataFunc();
    if (!data) return
    data = JSON.parse(data);
    // Getting max id by sorting reverse
    const ids = Object.keys(data);
    ids.sort((a: string, b: string) => Number.parseInt(b) - Number.parseInt(a));
    const id = (Number.parseInt(ids[0]) + 1).toString();
    // New object
    data[id] = {
        id: id,
        ...object,
        ...emptyFrequencyData
    };
    // Saving data
    saveDataFunc(JSON.stringify(data));
}

export function deleteObjectFromData(id: any, getDataFunc: any, saveDataFunc: any) {
    let data = getDataFunc();
    if (!data) return
    data = JSON.parse(data);
    delete data[id];
    saveDataFunc(JSON.stringify(data));
}

export function updateObjectOnData(id: any, object: any, getDataFunc: any, saveDataFunc: any) {
    let data = getDataFunc();
    if (!data) return
    data = JSON.parse(data);
    
    data[id] = object;

    saveDataFunc(JSON.stringify(data));
}

export function addOrUpdateFreqData(freqData: any, getFreqFunc: any, setFreqFunc: any) {
    let data = getFreqFunc();
    if (!data) return
    data = JSON.parse(data);
}