import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";
import { faker } from '@faker-js/faker';

export class CreateTransactionDto{
    @IsNotEmpty()
    @IsUUID()
    accountExternalIdDebit: string;
    @IsNotEmpty()
    @IsUUID()
    accountExternalIdCredit: string;
    @IsNotEmpty()
    @IsNumber()
    transferTypeId: number;
    @IsNotEmpty()
    @IsNumber()
    value: number;

    static createRandomTransaction(): CreateTransactionDto {
        return ({
            accountExternalIdDebit: faker.datatype.uuid(),
            accountExternalIdCredit: faker.datatype.uuid(),
            transferTypeId:  faker.datatype.number(1),
            value: faker.datatype.number({ min: 900, max: 1500 }),
            createdAt: faker.datatype.datetime()
        } as CreateTransactionDto);
    }

}

export class UpdateTransactionDto{
    @IsNotEmpty()
    @IsUUID()
    externalId: string;
    @IsNotEmpty()
    @IsString()
    status: string;

}