import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DYNAMODB_ENDPOINT, DYNAMODB_REGION} from "../config/config";

export const createDynamoDBClient = (): DynamoDBClient => {
	if(process.env.IS_OFFLINE) {
		return new DynamoDBClient({
			endpoint: DYNAMODB_ENDPOINT,
			region: "localhost",
		});
	}
	if (process.env.JEST_WORKER_ID) {
		return new DynamoDBClient({
			endpoint: DYNAMODB_ENDPOINT,
			region: DYNAMODB_REGION,
		});
	}
	return new DynamoDBClient({
		region: DYNAMODB_REGION,
	});
};
