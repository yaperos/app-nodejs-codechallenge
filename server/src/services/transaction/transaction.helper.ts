
const removeDuplicates = (arrayToRemoveDuplicates: number[]) => {
    return [...new Set(arrayToRemoveDuplicates)];
}

export {
    removeDuplicates
}
