export function validate(value: number): { status: "approved" | "rejected"; reason: string } {
    if (value > 1000) return { status: "rejected", reason: "Value greater than 1000" };
    return { status: "approved", reason: "OK" };
}
