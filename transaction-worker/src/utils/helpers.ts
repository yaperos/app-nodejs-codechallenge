export const currentDate = () => {
    return new Date().toLocaleString('en-US', {
        timeZone: 'America/Lima'
    });
}
