export function formatDate(dateString: any){
    const dateISO = new Date(dateString);
    if (isNaN(dateISO.getTime())) {
        return dateString;
    }
    dateString = dateISO.toISOString().split('T')[0].split('-');
    dateString.reverse();
    return dateString.join('/');
}

export function formatISODate(dateString: string): string{
    const dateISO = new Date(dateString);
    if (isNaN(dateISO.getTime())) {
        return dateString;
    }
    return dateISO.toISOString().split('T')[0];
}