export const monthShortToUpper = (monthIndex: number) => {
    // returns 'JAN','FEB', etc. or 'MAY'
    return new Date(2000, monthIndex, 1).toLocaleString('en-US', { month: 'short' }).toUpperCase();
};

export function formatInputDate(date: Date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}/${mm}/${dd}`;
}

export function formatIsoDate(date: Date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}
