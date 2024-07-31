export function formatDate(dateString: any){
    const dateISO = new Date(dateString);
    const day = dateISO.getDate() + 1;
    const month = dateISO.getMonth() + 1;
    
    const dayZero = day < 10 ? '0' : '';
    const monthZero = month < 10 ? '0' : '';

    return `${dayZero}${day}/${monthZero}${month}/${dateISO.getFullYear()}`;
}