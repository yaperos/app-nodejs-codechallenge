import { Injectable, Logger } from '@nestjs/common';
import { PrismaSelect } from '@paljs/plugins';
import { Prisma } from '@prisma/client';
import { GraphQLResolveInfo, OperationTypeNode } from 'graphql';
import { COMMON_MUTATION_FIELD_NAME } from 'src/utils/common.utils';
import { handleError } from '../../utils/error.utils';
import { CommonModel } from '../../utils/interfaces/common-model.interface';
import { CommonPayload } from '../../utils/mutations/common-payload.interface';
import { mapToPayload } from '../../utils/payload.utils';

@Injectable()
export class OperationHandlerService {
    private readonly logger = new Logger(OperationHandlerService.name);

    async handleAsync<K extends CommonPayload<T>, T extends CommonModel>(
        payload: K,
        operation: () => Promise<T>
    ): Promise<CommonPayload<T>> {
        try {
            const result = await operation();
            return mapToPayload(payload, result);
        } catch (err) {
            return handleError({
                payload,
                err,
                logger: this.logger,
            });
        }
    }

    handleSelect(
        info: GraphQLResolveInfo,
        defaultFields: Record<string, any>,
        modelName: keyof typeof Prisma.ModelName,
    ) {
        const select = new PrismaSelect(info, {
            defaultFields,
        });
        switch (info.operation.operation) {
        case OperationTypeNode.QUERY:
            return select.value;
        case OperationTypeNode.MUTATION:
            return select.valueOf(COMMON_MUTATION_FIELD_NAME, modelName);
        default:
            return select.value;
        }
    }
}
