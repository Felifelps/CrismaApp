export function formatDate(dateString: any){
    const dateISO = new Date(dateString);
    return dateISO.toLocaleDateString();
}

export function formatISODate(dateString: any){
    const dateISO = new Date(dateString);
    return dateISO.toISOString().slice(0, 10);
}