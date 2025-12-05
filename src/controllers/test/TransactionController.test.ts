// Simulamos las dependencias externas (repositorio y Kafka)
import { publishTransactionCreatedEvent } from "../../services/KafkaService";

// Controlador a probar
import {
  createTransaction,
  getTransactionById,
} from "../TransactionController";

// Tipos de Express para tipado de los mocks
import { Request, Response } from "express";

// --- Mocks de la capa de datos ---
const mockSave = jest.fn();
const mockFindOne = jest.fn();
const mockCreate = jest.fn((data) => ({
  ...data,
  transactionExternalId: "mock-uuid-1234",
}));

jest.mock("../../database/data-source", () => ({
  AppDataSource: {
    getRepository: jest.fn(() => ({
      create: mockCreate,
      save: mockSave,
      findOne: mockFindOne,
    })),
  },
}));

// Mock del productor de Kafka
jest.mock("../../services/KafkaService", () => ({
  publishTransactionCreatedEvent: jest.fn(),
}));

// --- Mocks de Express ---
const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
} as unknown as Response;

const mockRequest = (body: any = {}, params: any = {}): Partial<Request> => ({
  body,
  params,
});

// --- Data de apoyo para las pruebas ---
const transactionData = {
  accountExternalIdDebit: "debit-123",
  accountExternalIdCredit: "credit-456",
  tranferTypeId: 1,
  value: 100.5,
};

const savedTransaction = {
  ...transactionData,
  value: 100.5,
  transactionStatus: "pending",
  transactionExternalId: "mock-uuid-1234",
  createdAt: new Date(),
};

describe("TransactionController Unit Tests", () => {
  // Limpiamos todo antes de cada test para evitar basura entre pruebas
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ========================================================
  // Tests del endpoint POST /transaction
  // ========================================================
  describe("createTransaction", () => {
    test("Debe crear la transacción y disparar el evento Kafka (201)", async () => {
      // Mockeamos una inserción exitosa
      mockSave.mockResolvedValue(savedTransaction);

      await createTransaction(
        mockRequest(transactionData) as Request,
        mockResponse
      );

      // Se debe intentar guardar en la BD
      expect(mockSave).toHaveBeenCalledTimes(1);

      // Se debe enviar el evento a Kafka
      expect(publishTransactionCreatedEvent).toHaveBeenCalledWith(
        savedTransaction
      );

      // Respuesta esperada
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Transaction created and pending validation",
        transactionExternalId: savedTransaction.transactionExternalId,
      });
    });

    test("Debe retornar 400 si falta algún campo requerido", async () => {
      const incompleteData = { value: 100 };

      await createTransaction(
        mockRequest(incompleteData) as Request,
        mockResponse
      );

      // No debe intentar persistir ni emitir eventos
      expect(mockSave).not.toHaveBeenCalled();
      expect(publishTransactionCreatedEvent).not.toHaveBeenCalled();

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Missing required fields",
      });
    });

    test("Debe retornar 500 si la base de datos falla al guardar", async () => {
      mockSave.mockRejectedValue(new Error("DB connection failed"));

      await createTransaction(
        mockRequest(transactionData) as Request,
        mockResponse
      );

      // Se intentó guardar
      expect(mockSave).toHaveBeenCalledTimes(1);

      // No debe emitirse evento si no se guardó
      expect(publishTransactionCreatedEvent).not.toHaveBeenCalled();

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Internal Server Error",
      });
    });
  });

  // ========================================================
  // Tests del endpoint GET /transaction/:id
  // ========================================================
  describe("getTransactionById", () => {
    test("Debe retornar la transacción cuando existe (200)", async () => {
      mockFindOne.mockResolvedValue(savedTransaction);

      await getTransactionById(
        mockRequest(
          {},
          { id: savedTransaction.transactionExternalId }
        ) as Request,
        mockResponse
      );

      expect(mockFindOne).toHaveBeenCalledWith({
        where: {
          transactionExternalId: savedTransaction.transactionExternalId,
        },
      });

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        transactionExternalId: savedTransaction.transactionExternalId,
        transactionType: { name: savedTransaction.tranferTypeId },
        transactionStatus: { name: savedTransaction.transactionStatus },
        value: savedTransaction.value,
        createdAt: savedTransaction.createdAt,
      });
    });

    test("Debe retornar 404 si no se encuentra la transacción", async () => {
      mockFindOne.mockResolvedValue(null);

      await getTransactionById(
        mockRequest({}, { id: "non-existent-id" }) as Request,
        mockResponse
      );

      expect(mockFindOne).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Transaction not found",
      });
    });

    test("Debe retornar 400 si el ID no viene en los parámetros", async () => {
      await getTransactionById(mockRequest({}, {}) as Request, mockResponse);

      expect(mockFindOne).not.toHaveBeenCalled();

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Transaction ID is required",
      });
    });

    test("Debe retornar 500 si ocurre un error inesperado al consultar la BD", async () => {
      mockFindOne.mockRejectedValue(
        new Error("DB read failed due to connection error")
      );

      await getTransactionById(
        mockRequest({}, { id: "any-id" }) as Request,
        mockResponse
      );

      expect(mockFindOne).toHaveBeenCalledTimes(1);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Internal Server Error",
      });
    });
  });
});
