import { PrismaClient } from '@prisma/client';

interface TransactionStatusInputCreate {
	idStatus: number;
	name: string;
}

interface TransactionTypesInputCreate {
    idType: number
    name: string
}

const prisma = new PrismaClient();

const createManyTrasactionStatus = async () => {
	if ((await prisma.transactionStatus.count()) !== 0) {
		return;
	}
    // create data
    let status_1: TransactionStatusInputCreate = {
        idStatus: 1,
        name: "pending",
    };

    // insert to DB
    await prisma.transactionStatus.create({
        data: {
            ...status_1,
        },
    });

    // create data
    let status_2: TransactionStatusInputCreate = {
        idStatus: 2,
        name: "approved",
    };

    // insert to DB
    await prisma.transactionStatus.create({
        data: {
            ...status_2,
        },
    });

        // create data
    let status_3: TransactionStatusInputCreate = {
        idStatus: 3,
        name: "rejected",
    };

    // insert to DB
    await prisma.transactionStatus.create({
        data: {
            ...status_3,
        },
    });
};

const createManyTrasactionTypes = async () => {
	if ((await prisma.transactionType.count()) !== 0) {
		return;
	}
    // create data
    let type_1: TransactionTypesInputCreate = {
        idType: 1,
        name: "type_1",
    };

    // insert to DB
    await prisma.transactionType.create({
        data: {
            ...type_1,
        },
    });

    // create data
    let type_2: TransactionTypesInputCreate = {
        idType: 2,
        name: "type_2",
    };

    // insert to DB
    await prisma.transactionType.create({
        data: {
            ...type_2,
        },
    });

    // create data
    let type_3: TransactionTypesInputCreate = {
        idType: 3,
        name: "type_3",
    };

    // insert to DB
    await prisma.transactionType.create({
        data: {
            ...type_3,
        },
    });
};


const run = async () => {
	const prisma = new PrismaClient();
	try {
		console.log('createManyTrasactionStatus() -> start');
		await createManyTrasactionStatus();
		console.log('createManyTrasactionStatus() -> done');

		console.log('createManyTrasactionTypes() -> start');
		await createManyTrasactionTypes();
		console.log('createManyTrasactionTypes() -> done');

	} finally {
		await prisma.$disconnect();
	}
};

run();