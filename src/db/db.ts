import {DynamoDBClient} from "@aws-sdk/client-dynamodb";

export const createDynamoDBClient = (): DynamoDBClient => {
	if(process.env.IS_OFFLINE) {
		return new DynamoDBClient({
			endpoint: "http://localhost:8000",
			region: "localhost",
		});
	}
	if (process.env.JEST_WORKER_ID) {
		return new DynamoDBClient({
			endpoint: 'http://localhost:8000',
			region: 'local-env',
		});
	}
	return new DynamoDBClient({
		region: "us-east-1",
	});
};
