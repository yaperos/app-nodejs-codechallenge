import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseUUIDPipe,
  ParseIntPipe,
  DefaultValuePipe,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from "@nestjs/swagger";
import { ThrottlerGuard } from "@nestjs/throttler";
import { TransactionService } from "../../application/services/transaction.service";
import { CreateTransactionDto } from "../../application/dto/create-transaction.dto";
import { TransactionStatus } from "../../domain/entities/transaction.entity";

@ApiTags("transactions")
@Controller("transactions")
@UseGuards(ThrottlerGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Create a new transaction",
    description: "Creates a new financial transaction between two accounts",
  })
  @ApiResponse({
    status: 201,
    description: "Transaction created successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Invalid request data",
  })
  @ApiResponse({
    status: 409,
    description: "Transaction with idempotency key already exists",
  })
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    const transaction =
      await this.transactionService.createTransaction(createTransactionDto);
    return {
      success: true,
      data: {
        id: transaction.id,
        externalId: transaction.externalId,
        status: transaction.status,
        amount: transaction.amount,
        currency: transaction.currency,
        createdAt: transaction.createdAt,
      },
    };
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get transaction by ID",
    description: "Retrieves a transaction by its unique identifier",
  })
  @ApiParam({
    name: "id",
    description: "Transaction UUID",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @ApiResponse({
    status: 200,
    description: "Transaction found",
  })
  @ApiResponse({
    status: 404,
    description: "Transaction not found",
  })
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    const transaction = await this.transactionService.getTransaction(id);
    return {
      success: true,
      data: transaction,
    };
  }

  @Get("external/:externalId")
  @ApiOperation({
    summary: "Get transaction by external ID",
    description: "Retrieves a transaction by its external identifier",
  })
  @ApiParam({
    name: "externalId",
    description: "External transaction ID",
  })
  @ApiResponse({
    status: 200,
    description: "Transaction found",
  })
  @ApiResponse({
    status: 404,
    description: "Transaction not found",
  })
  async findByExternalId(@Param("externalId") externalId: string) {
    const transaction =
      await this.transactionService.getTransactionByExternalId(externalId);
    return {
      success: true,
      data: transaction,
    };
  }

  @Get("account/:accountId")
  @ApiOperation({
    summary: "Get transactions by account ID",
    description: "Retrieves all transactions for a specific account",
  })
  @ApiParam({
    name: "accountId",
    description: "Account identifier",
    example: "+51999888777",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Number of transactions to return",
    example: 100,
  })
  @ApiQuery({
    name: "offset",
    required: false,
    description: "Number of transactions to skip",
    example: 0,
  })
  @ApiResponse({
    status: 200,
    description: "Transactions retrieved successfully",
  })
  async findByAccount(
    @Param("accountId") accountId: string,
    @Query("limit", new DefaultValuePipe(100), ParseIntPipe) limit: number,
    @Query("offset", new DefaultValuePipe(0), ParseIntPipe) offset: number
  ) {
    const transactions =
      await this.transactionService.getTransactionsByAccountId(
        accountId,
        limit,
        offset
      );
    return {
      success: true,
      data: transactions,
      pagination: {
        limit,
        offset,
        count: transactions.length,
      },
    };
  }

  @Get("status/:status")
  @ApiOperation({
    summary: "Get transactions by status",
    description: "Retrieves transactions filtered by status",
  })
  @ApiParam({
    name: "status",
    enum: TransactionStatus,
    description: "Transaction status",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Number of transactions to return",
    example: 100,
  })
  @ApiResponse({
    status: 200,
    description: "Transactions retrieved successfully",
  })
  async findByStatus(
    @Param("status") status: TransactionStatus,
    @Query("limit", new DefaultValuePipe(100), ParseIntPipe) limit: number
  ) {
    const transactions = await this.transactionService.getTransactionsByStatus(
      status,
      limit
    );
    return {
      success: true,
      data: transactions,
      count: transactions.length,
    };
  }

  @Post(":id/reverse")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Reverse a transaction",
    description: "Creates a reversal transaction for the specified transaction",
  })
  @ApiParam({
    name: "id",
    description: "Transaction UUID to reverse",
  })
  @ApiResponse({
    status: 200,
    description: "Transaction reversed successfully",
  })
  @ApiResponse({
    status: 404,
    description: "Transaction not found",
  })
  @ApiResponse({
    status: 409,
    description: "Transaction cannot be reversed",
  })
  async reverse(
    @Param("id", ParseUUIDPipe) id: string,
    @Body("reason") reason?: string
  ) {
    const reversalTransaction =
      await this.transactionService.reverseTransaction(id, reason);
    return {
      success: true,
      data: {
        reversalTransactionId: reversalTransaction.id,
        originalTransactionId: id,
        status: reversalTransaction.status,
        amount: reversalTransaction.amount,
      },
    };
  }

  @Post("retry-failed")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Retry failed transactions",
    description: "Retries transactions that failed and are eligible for retry",
  })
  @ApiResponse({
    status: 200,
    description: "Failed transactions queued for retry",
  })
  async retryFailed() {
    const count = await this.transactionService.retryFailedTransactions();
    return {
      success: true,
      data: {
        retriedCount: count,
      },
    };
  }

  @Get("statistics/summary")
  @ApiOperation({
    summary: "Get transaction statistics",
    description: "Retrieves summary statistics for transactions",
  })
  @ApiQuery({
    name: "startDate",
    required: false,
    description: "Start date for statistics (ISO 8601)",
    example: "2024-01-01T00:00:00Z",
  })
  @ApiQuery({
    name: "endDate",
    required: false,
    description: "End date for statistics (ISO 8601)",
    example: "2024-12-31T23:59:59Z",
  })
  @ApiResponse({
    status: 200,
    description: "Statistics retrieved successfully",
  })
  async getStatistics(
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string
  ) {
    const stats = await this.transactionService.getStatistics(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    );
    return {
      success: true,
      data: stats,
    };
  }
}
