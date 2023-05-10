export type IResponse<typeData> = {
    status: boolean;
    data?: typeData;
    error?: string;
};