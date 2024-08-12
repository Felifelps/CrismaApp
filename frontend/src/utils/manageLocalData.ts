import { getFreq, setFreq } from "./localStorage";

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

export const emptyFreq = {
    frequenciadomingo: {},
    frequenciaencontro: {}
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
    if (!data) return;
    data = JSON.parse(data);
    delete data[id];
    saveDataFunc(JSON.stringify(data));
}

export function updateObjectOnData(id: any, object: any, getDataFunc: any, saveDataFunc: any, statsFunc: any) {
    let data = getDataFunc();
    if (!data) return;
    statsFunc((stats: any) => {
        data = JSON.parse(data);
        
        data[id] = {
            id: id,
            ...object,
            ...JSON.parse(stats)
        };

        saveDataFunc(JSON.stringify(data));
    })
}

export function UpdateFreqData(freqData: any, objectField: any, objectId: any) {
    let data: any = getFreq();
    if (!data) {
        data = JSON.stringify(emptyFreq);
    }

    data = JSON.parse(data);

    if (data.hasOwnProperty('message')) {
        delete data.message
    }

    freqData = JSON.parse(freqData);

    for (let freqList of Object.keys(data)) {
        let values: any[] = Object.values(data[freqList]);
        for (let i = 0; i < values.length; i++) {
            let obj: any = values[i];
            console.log(objectId)
            if (obj[objectField].toString() !== objectId) {
                delete data[freqList][obj.id]
            }
        }
    }

    for (let freqList of Object.keys(freqData)) {
        data[freqList] = {
            ...data[freqList],
            ...freqData[freqList]
        }
    }

    setFreq(JSON.stringify(data));
}