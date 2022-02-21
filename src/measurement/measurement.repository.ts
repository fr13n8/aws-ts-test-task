import {Measurement, MeasurementList} from "./measurement.interfaces";
import {
	DynamoDBClient,
	PutItemCommand, PutItemCommandInput,
	ScanCommand, ScanCommandInput,
	DeleteItemCommand, DeleteItemCommandInput,
	UpdateItemCommandInput, UpdateItemCommand,
	GetItemCommandInput, GetItemCommand
} from "@aws-sdk/client-dynamodb";

export class MeasurementRepository {
	private readonly tableName = process.env.MEASUREMENTS_TABLE;
	public constructor(
        private readonly dynamoDb: DynamoDBClient,
	) {}

	public async create(measurement: Measurement): Promise<Measurement> {
		const timestamp = Date.now().toString();
		const params: PutItemCommandInput = {
			TableName: this.tableName,
			Item: {
				id: {
					S: measurement.id
				},
				name: {
					S: measurement.name
				},
				createdAt: {
					N: timestamp
				},
				updatedAt: {
					N: timestamp
				},
			}
		};

		const command = new PutItemCommand(params);
		try {
			await this.dynamoDb.send(command);
			return {
				...measurement,
				createdAt: timestamp,
				updatedAt: timestamp
			};
		} catch (error) {
			console.log(error.message);
			throw new Error('Failed to create measurement');
		}
	}

	public async findAll(): Promise<MeasurementList> {
		const params: ScanCommandInput = {
			TableName: this.tableName
		};

		const command = new ScanCommand(params);
		try {
			const result = await this.dynamoDb.send(command);

			return result.Items.map(item => ({
				id: item.id?.S,
				name: item.name?.S,
				createdAt: item.createdAt?.N,
				updatedAt: item.updatedAt?.N
			}));
		} catch (error) {
			console.log(error.message);
			throw new Error("Error finding measurements");
		}
	}

	public async remove(id: string): Promise<boolean> {
		const params: DeleteItemCommandInput = {
			TableName: this.tableName,
			Key: {
				id: {
					S: id
				}
			}
		};

		const command = new DeleteItemCommand(params);
		try {
			await this.dynamoDb.send(command);
			return true;
		} catch (error) {
			console.log(error.message);
			throw new Error("Error deleting measurement");
		}
	}

	public async update(id: string, measurement: Measurement): Promise<Measurement> {
		const timestamp = Date.now().toString();

		measurement = {
			...measurement,
			updatedAt: timestamp
		};
		const params: UpdateItemCommandInput = {
			TableName: this.tableName,
			Key: {
				"id": {
					S: id
				}
			},
			UpdateExpression: "set #name = :name, #updatedAt = :updatedAt",
			ExpressionAttributeNames: {
				"#name": "name",
				"#updatedAt": "updatedAt"
			},
			ExpressionAttributeValues: {
				":name": {
					S: measurement.name
				},
				":updatedAt": {
					N: measurement.updatedAt
				}
			},
			ReturnValues: "ALL_NEW"
		};

		const command = new UpdateItemCommand(params);
		try {
			const result = await this.dynamoDb.send(command);
			return {
				id: result.Attributes.id.S,
				name: result.Attributes.name.S,
				createdAt: result.Attributes.createdAt.N,
				updatedAt: result.Attributes.updatedAt.N
			};
		} catch (error) {
			console.log(error.message);
			throw new Error("Error updating measurement");
		}
	}

	public async findOne(id: string): Promise<Measurement> {
		const params: GetItemCommandInput = {
			TableName: this.tableName,
			Key: {
				id: {
					S: id
				}
			}
		};

		const command = new GetItemCommand(params);
		try {
			const result = await this.dynamoDb.send(command);
			if (result.Item) {
				return {
					id: result.Item.id.S,
					name: result.Item.name.S,
					createdAt: result.Item.createdAt.N,
					updatedAt: result.Item.updatedAt.N
				};
			}
			return null;
		} catch (error) {
			console.log(error.message);
			throw new Error("Error finding measurement");
		}
	}
}
