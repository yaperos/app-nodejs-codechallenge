import { CommonMutationStatus } from 'src/common/enums/common-mutation-status.enum';
import { CommonModel } from './interfaces/common-model.interface';
import { CommonPayload } from './mutations/common-payload.interface';

export function mapToPayload<
    K extends CommonPayload<any>,
    T extends CommonModel
>(payload: K, model: T): K {
    payload.record = model;
    payload.recordId = model.id.toString();
    payload.status = CommonMutationStatus.SUCCESS;
    return payload;
}
