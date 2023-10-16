import {FilterQuery, Model, Types, UpdateQuery} from "mongoose"
import { AbstractDocument } from "@app/common/database/abstract.schema"

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
    constructor(protected readonly model: Model<TDocument>) {}

    async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
        const createDocument = new this.model({
            ...document,
            _id: new Types.ObjectId()
        })
        return (await createDocument.save()).toJSON() as unknown as TDocument
    }

    async find(filterQuery: FilterQuery<TDocument>) {
        return this.model.find(filterQuery, {}, {lean: true})
    }

    async findOne(filterQuery: FilterQuery<TDocument>) {
        const document = await this.model.findOne(filterQuery, {}, {lean: true})
        if (!document) {
            console.error(`Document not found ${filterQuery}`)
        }
        return document
    }

    async findOneAndUpdate(
        filterQuery: FilterQuery<TDocument>,
        updateQuery: UpdateQuery<TDocument>
    ): Promise<TDocument> {
        return this.model.findOneAndUpdate(filterQuery, updateQuery,);
    }

    async findOneAndDelete(filterQuery: FilterQuery<TDocument>) {
        return this.model.findOneAndDelete(filterQuery, {lean: true})
    }

    async deleteMany() {
        return this.model.deleteMany()
    }
}