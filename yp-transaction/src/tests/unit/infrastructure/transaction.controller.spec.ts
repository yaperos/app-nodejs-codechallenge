import { Request, Response } from 'express';
import TransactionController from "../../../infrastructure/controller/transaction.ctrl"
import TransactionUseCase from "../../../application/transaction.UseCase";
import { TransactionRepositoryMock, EventServiceMock } from "./transaction.controller.mock"
import { TransactionTypes } from "../../../domain/transaction.entity";

describe("Transaction UseCase", () => {
    let controller: TransactionController;

    beforeEach(async() => {
        const trMock = new TransactionRepositoryMock();
        const trUseCase = new TransactionUseCase(trMock, new EventServiceMock())
        controller = new TransactionController(trUseCase);
    })

    it("it should create a transaction and response 200", async() => {
        const req = {
            body: {
                accountExternalIdDebit: "2daadc86-1c14-4b76-829f-a8b2a8427adb",
                accountExternalIdCredit: "31510106-1ec8-4c3a-b0a4-28c06522a1b0",
                tranferTypeId: TransactionTypes.TRANSACTION_DEPOSIT,
                value: 18.50,
            }
        } as Request;

        const res = {
            json: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
        } as unknown as Response;
        
        await controller.createTransaction(req,res)

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            createdAt: expect.any(String),
            value: 18.5,
            transactionType: {
                name: expect.any(String)
            },
            transactionStatus: {
                name: expect.any(String)
            },
            transactionExternalId: expect.any(String),
        })
    });

    it("it should not create a transaction and response 500, transferId invalid", async() => {
        const req = {
            body: {
                accountExternalIdDebit: "2daadc86-1c14-4b76-829f-a8b2a8427adb",
                accountExternalIdCredit: "31510106-1ec8-4c3a-b0a4-28c06522a1b0",
                tranferTypeId: 11,
                value: 120,
            }
        } as Request;

        const res = {
            json: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
        } as unknown as Response;
        
        await controller.createTransaction(req,res)

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: "Not valid transfer type",
            messageId: "INTERNAL_SERVER_ERROR",
            message: "Internal server error",
            statusCode: 500,
            success: false
        })
    });

    it("it should not create a transaction and response 500, value request invalid", async() => {
        const req = {
            body: {
                accountExternalIdDebit: "2daadc86-1c14-4b76-829f-a8b2a8427adb",
                accountExternalIdCredit: "31510106-1ec8-4c3a-b0a4-28c06522a1b0",
                tranferTypeId: TransactionTypes.TRANSACTION_DEPOSIT,
                value: "120AAAA",
            }
        } as Request;

        const res = {
            json: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
        } as unknown as Response;
        
        await controller.createTransaction(req,res)

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: expect.any(String),
            messageId: "INTERNAL_SERVER_ERROR",
            message: "Internal server error",
            statusCode: 500,
            success: false
        })
    });
});