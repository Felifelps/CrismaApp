export function formatDate(dateString: any){
    const dateISO = new Date(dateString);
    return dateISO.toLocaleString().split(',')[0];
}

export function formatISODate(dateString: string): string{
    const dateISO = new Date(dateString);
    if (isNaN(dateISO.getTime())) {
        return dateString;
    }
    return dateISO.toISOString().split('T')[0];
}