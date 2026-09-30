export const TRANSFER_TYPES: Readonly<Record<number, string>> = {
    1: 'TRANSFER',
    2: 'PAYMENT',
    3: 'WITHDRAWAL',
};

export const TRANSFER_TYPE_IDS: number[] = Object.keys(TRANSFER_TYPES).map(Number);

export const transferTypeName = (id: number): string => TRANSFER_TYPES[id] ?? 'UNKNOWN';