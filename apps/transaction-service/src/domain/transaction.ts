export function transferTypeName(transferTypeId: number): string {
    if (transferTypeId === 1) return "TRANSFER";
    return `TYPE_${transferTypeId}`;
}
