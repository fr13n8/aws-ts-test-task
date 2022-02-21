import {APIGatewayEvent} from "aws-lambda";

const APIGatewayRequest = (config): APIGatewayEvent => {
	return {
		headers: {},
		httpMethod: "",
		isBase64Encoded: false,
		multiValueHeaders: {},
		multiValueQueryStringParameters: null,
		path: "",
		requestContext: {
			accountId: null,
			apiId: null,
			authorizer: null,
			protocol: null,
			httpMethod: "",
			identity: null,
			path: null,
			stage: null,
			requestId: null,
			requestTimeEpoch: null,
			resourceId: null,
			resourcePath: null,
		},
		resource: "",
		stageVariables: null,
		body: config.body ? JSON.stringify(config.body) : null,
		...config.pathParametersObject && { pathParameters: config.pathParametersObject },
		...config.queryStringObject && { queryStringParameters: config.queryStringObject }
	};
};

export default {
	APIGatewayRequest
};
