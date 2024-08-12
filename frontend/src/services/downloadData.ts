import { apiUrl } from "../utils/constants";
import { handleFetchResponse } from "./handleFetchResponse";

export function downloadData(
        resource: string,
        token: any,
        onDone: any
    ) {
    fetch(apiUrl + resource + '/data', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    }).then(response => handleFetchResponse(
        response,
        onDone,
        (data: any) => downloadCSV(data, resource.replace('/', '') + '.csv'),
        true
    ))
}

const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
};