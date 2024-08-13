export const sortByText = (text1: any, text2: any) => text1.localeCompare(text2)

export const sortByDateStringsDesc = (date1: any, date2: any) => (new Date(date2)).getTime() - (new Date(date1)).getTime();

export const sortByDateStringsAsc = (date1: any, date2: any) => (new Date(date1)).getTime() - (new Date(date2)).getTime();
