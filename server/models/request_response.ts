import type { Response } from "express";

// Response is the standard structure of response secretEcho Science APIs will
// return to the user
export type MSResponse<T> = {
	success: boolean;
	data: T;
	errors: string[];
};

export function ReturnSuccess(response: Response, data: any, statusCode?: number) {
	const SuccessResponse: MSResponse<any> = {
		success: true,
		data: data,
		errors: [],
	};

	return response.status(statusCode ?? 200).json(SuccessResponse);
}

export function ReturnError(response: Response, errors: string[], statusCode?: number) {
	const ErrorResponse: MSResponse<any> = {
		success: false,
		data: null,
		errors: errors,
	};

	return response.status(statusCode ?? 400).json(ErrorResponse);
}
