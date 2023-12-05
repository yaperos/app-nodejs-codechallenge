import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTransactionRequestDto } from './dto/create-transaction.req.dto';
import { CreateTransactionResponseDto } from './dto/create-transaction.res.dto';
import { GetTransactionResponseDto } from './dto/get-transaction.res.dto';
import Page from './dto/Page';
import { TransactionService } from './transaction.service';

@Controller('transactions')
@ApiTags('transactions')
export class TransactionController {
	constructor(private readonly transactionService: TransactionService) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Get all transactions' })
	public async getAll(): Promise<Page<GetTransactionResponseDto>> {
		const [transaction, countAll] = await this.transactionService.getAll();
		return Page.create<GetTransactionResponseDto>(
			transaction.map((transaction) => new GetTransactionResponseDto(transaction)),
			countAll,
		);
	}

	@Get('/:transactionExternalId')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Get transaction by transactionExternalId' })
	public async getById(
		@Param('transactionExternalId') transactionExternalId: string,
	): Promise<GetTransactionResponseDto> {
		const transaction = await this.transactionService.getByTransactionExternalId(transactionExternalId);
		return new GetTransactionResponseDto(transaction);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: 'Create transaction' })
	public async create(@Body() request: CreateTransactionRequestDto): Promise<CreateTransactionResponseDto> {
		const transaction = await this.transactionService.create(request);
		return new CreateTransactionResponseDto(transaction);
	}
}
