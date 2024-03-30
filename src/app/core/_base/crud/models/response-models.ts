
export enum ResponseStatus {
	None = 0, Success = 1, Error = 2, Warning = 3, Info = 4, Unknown = 5
}

export class ResponseModel {
	NewId: number = 0;
	Code!: number;
	Message!: string;
	ReturnObject: any;
	Status: ResponseStatus = ResponseStatus.Success
}


export interface IApiResponseModel {
    Errors: any[];
    isSuccess: boolean;
    Message: any;
    Response: any;
    statusCode: number;
}

export class ApiResponseModel implements IApiResponseModel {
    Errors!: any[];
    isSuccess!: boolean;
    Message: any;
    Response: any;
    statusCode!: number;
    successFunc!: () => void;
    errorFunc!: () => void;
}

export const SERVER_ERROR_MESSAGE = 'Error in processing. Please try again.';