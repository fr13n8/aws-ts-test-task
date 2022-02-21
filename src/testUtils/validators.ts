import {APIGatewayProxyResult} from "aws-lambda";

export const isApiGatewayResponse = (response: APIGatewayProxyResult): boolean => {
	const { body, headers, statusCode } = response;

	if (!body || !headers || !statusCode) return false;
	if (typeof statusCode !== 'number') return false;
	if (typeof body !== 'string') return false;
	return isCorrectHeaders(headers);
};

const isCorrectHeaders = headers => {
	if (headers['Content-Type'] !== 'application/json') return false;
	return headers['Access-Control-Allow-Origin'] === '*';
};
