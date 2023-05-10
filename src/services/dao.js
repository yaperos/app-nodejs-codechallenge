const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createTransaction = async (req) => {
    const newTransaction = await prisma.transactions.create({
        data: {
            id_type: req.id_type, account_external_id_debit: req.account_external_id_debit, account_external_id_credit: req.account_external_id_credit, value: req.value, status: 'pending', create_at: new Date(Date.now())
        }
    })

    return newTransaction
}

exports.updateTransaction = async (req) => {
    const newTransaction = await prisma.transactions.update({
        where: {
            id: req.id
        },
        data: {
            id_type: req.id_type, account_external_id_debit: req.account_external_id_debit, account_external_id_credit: req.account_external_id_credit, value: req.value, status: req.status, create_at: new Date(Date.now())
        }
    })

    return newTransaction
}


exports.createTransfer = async (req) => {
    const newTransfer = await prisma.transfer_type.create({
        data: {
            req
        }
    })
}


exports.findById = async (id) => {
    const res = await prisma.transactions.findUnique({
        where: {
            id
        }
    })

    return res
}

exports.findAll = async () => {

    const res = await prisma.transfer_type.findMany()
    return res
}