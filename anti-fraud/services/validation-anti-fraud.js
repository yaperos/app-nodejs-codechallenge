export const ValidationAntiFraud = (data) => {
    const { id, value } = JSON.parse(data);
    if(value > 1000) return JSON.stringify({
        id,
        status: 3
    });

    return JSON.stringify({
        id,
        status: 2
    });
}