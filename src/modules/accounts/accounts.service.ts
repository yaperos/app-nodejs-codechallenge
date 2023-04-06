import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Query, QueryOptions } from 'mongoose';
import { Account, AccountDocument } from './account.schema';
import { CreateAccountDto } from './dtos/create-account.dto';
import { UpdateAccountDto } from './dtos/update-account.dto';

@Injectable()
export class AccountsService {
    constructor(@InjectModel(Account.name) private readonly accountModel: Model<AccountDocument>) {
    }


    async create(createDto: CreateAccountDto) {
        const entity = new this.accountModel(createDto);
        return entity.save();
    }

    async findAll(
        query: FilterQuery<Account> = {},
        options: QueryOptions<Account> = {}
    ) {
        const entities = await this.accountModel.find(query, null, options).exec();
        return entities;
    }

    async findById(id: string) {
        const entity = await this.accountModel.findById(id).exec();
        if (!entity) {
            throw new NotFoundException(`Entity with id ${id} not found`);
        }
        return entity;
    }

    async findOne(query: FilterQuery<Account> = {}) {
        const entity = await this.accountModel.findOne(query).exec();
        if (!entity) {
            throw new NotFoundException(`Not found`);
        }
        return entity;
    }


    async update(id: string, updateDto: UpdateAccountDto): Promise<Account> {
        const entity = await this.accountModel.findById(id).exec();
        if (!entity) {
            throw new NotFoundException(`Entity with id ${id} not found`);
        }

        Object.assign(entity, updateDto);
        const savedEntity = await entity.save();
        return savedEntity;
    }

    async delete(id: string) {
        const entity = await this.accountModel.findById(id).exec();
        if (!entity) {
            throw new NotFoundException(`Entity with id ${id} not found`);
        }

        const deleted = await this.accountModel.deleteOne({ _id: entity._id }).exec();
        if (!deleted.acknowledged) {
            return null;
        }

        return entity;
    }
}