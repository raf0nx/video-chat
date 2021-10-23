import { AxiosRequestConfig } from "axios";

export interface ErrorValidationResponse {
	config: AxiosRequestConfig;
	data: ValidationError;
	headers: { "content-length": string; "content-type": string };
	request: XMLHttpRequest;
	status: number;
	statusText: string;
}

interface ValidationError {
	errors: Field;
}

interface Field {
	[key: string]: {
		location: string;
		msg: string;
		param: string;
		value: string;
	};
}
