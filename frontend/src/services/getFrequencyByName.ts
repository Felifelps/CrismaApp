import * as ls from "../utils/localStorage";
import { apiUrl } from "../utils/constants";

const flashes: any = {
    '200': 'Frequência encontrada:1',
    '404': 'Nome não encontrado:0',
};

export function getFrequencyByName(
        name: any,
        onDone: any = () => console.log('Data got')
    ) {
    let status = 0;
    fetch(apiUrl + '/frequency/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            search: name
        })
    }).then(response => {
        const flash = flashes[response.status.toString()];
        ls.setFlash(flash ? flash : '');
        status = response.status;
        return response.json()
    }).then(data => {
        if (status === 200) {
            ls.setFreq(JSON.stringify(data))
        }
        onDone();
    })
}
