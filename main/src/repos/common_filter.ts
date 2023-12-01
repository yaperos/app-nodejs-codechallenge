export function filterPagination(
    page?: number,
    limit?: number
): { offset?: number; limit?: number } {
    const limitValue = limit ? limit : 10

    return {
        offset: page ? (page - 1) * limitValue : undefined,
        limit: limit ? +limit : undefined,
    }
}

export function DateToNumber(date?: Date): number | undefined {
    return date ? Math.floor(date.getTime() / 1000) : undefined
}
