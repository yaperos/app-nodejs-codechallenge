import { CommonMutationStatus } from '../../common/enums/common-mutation-status.enum';
import { CommonProblem } from '../errors/common-problem.model';

export interface CommonPayload<T> {
    recordId: String | null;
    record: T | null;
    status: keyof typeof CommonMutationStatus;
    errors: [CommonProblem];
}
