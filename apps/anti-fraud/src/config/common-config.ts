export default () => ({
    amountApprovedTX: process.env.AMOUNT_APPROVED_TX ? Number(process.env.AMOUNT_APPROVED_TX) : 1000
})