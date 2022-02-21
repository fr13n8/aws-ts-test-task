import {Point, PointsList} from "./point.interfaces";
import {
	DynamoDBClient,
	ScanCommand,
	ScanCommandInput,
	ScanCommandOutput,
	DeleteItemCommand,
	DeleteItemCommandInput,
	UpdateItemCommandInput,
	UpdateItemCommand,
	UpdateItemCommandOutput,
	GetItemCommandInput,
	GetItemCommand,
	GetItemCommandOutput,
	BatchWriteItemCommandInput,
	BatchWriteItemCommand,
} from "@aws-sdk/client-dynamodb";
import {v4 as uuid4} from "uuid";

export class PointRepository {
	private readonly tableName = process.env.POINTS_TABLE;
	public constructor(
        private readonly dynamoDb: DynamoDBClient,
	) {}

	public async create(measurementId: string, points: PointsList): Promise<PointsList> {
		const timestamp = Date.now().toString();
		const items = points.map(point => ({
			PutRequest: {
				Item: {
					id: {S: uuid4()},
					x: {N: point.x.toString()},
					y: {N: point.y.toString()},
					z: {N: point.z.toString()},
					accuracy: {N: point.accuracy.toString()},
					measurementId: {S: measurementId},
					createdAt: {S: timestamp},
					updatedAt: {S: timestamp},
				},
			},
		}));
		const batchParams: BatchWriteItemCommandInput = {
			RequestItems: {
				[this.tableName]: items,
			},
		};

		const command = new BatchWriteItemCommand(batchParams);
		try {
			await this.dynamoDb.send(command);
			return items.map( item => ({
				id: item.PutRequest.Item.id?.S,
				x: +item.PutRequest.Item.x?.N,
				y: +item.PutRequest.Item.y?.N,
				z: +item.PutRequest.Item.z?.N,
				accuracy: +item.PutRequest.Item.accuracy?.N,
				measurementId: item.PutRequest.Item.measurementId.S,
				createdAt: item.PutRequest.Item.createdAt.S,
				updatedAt: item.PutRequest.Item.updatedAt.S,
			}));
		} catch (error) {
			console.log(error);
			throw "Error creating point";
		}
	}

	public async findAll(measurementId: string): Promise<PointsList> {
		const params: ScanCommandInput = {
			TableName: this.tableName,
			FilterExpression: "measurementId = :measurementId",
			ExpressionAttributeValues: {
				":measurementId": {
					S: measurementId
				}
			}
		};

		const command = new ScanCommand(params);
		try {
			const result: ScanCommandOutput = await this.dynamoDb.send(command);

			return result.Items.map((item): Point => ({
				id: item.id.S,
				x: +item.x?.N,
				y: +item.y?.N,
				z: +item.z?.N,
				accuracy: +item.accuracy?.N,
				measurementId: item.measurementId.S,
				createdAt: item.createdAt.S,
				updatedAt: item.updatedAt.S
			}));
		} catch (error) {
			console.log(error);
			throw "Error finding points";
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
			console.log(error);
			throw "Error removing point";
		}
	}

	public async update(id: string, point: Point): Promise<Point> {
		const timestamp = Date.now().toString();

		const params: UpdateItemCommandInput = {
			TableName: this.tableName,
			Key: {
				"id": {
					S: id
				}
			},
			UpdateExpression: "set #x = :x, #y = :y, #z = :z, #accuracy = :accuracy, #updatedAt = :updatedAt",
			ExpressionAttributeNames: {
				"#x": "x",
				"#y": "y",
				"#z": "z",
				"#accuracy": "accuracy",
				"#updatedAt": "updatedAt"
			},
			ExpressionAttributeValues: {
				":x": {
					N: point.x.toString()
				},
				":y": {
					N: point.y.toString()
				},
				":z": {
					N: point.z.toString()
				},
				":accuracy": {
					N: point.accuracy.toString()
				},
				":updatedAt": {
					S: timestamp
				}
			},
			ReturnValues: "ALL_NEW"
		};

		const command = new UpdateItemCommand(params);
		try {
			const result: UpdateItemCommandOutput = await this.dynamoDb.send(command);

			return {
				id: result.Attributes.id.S,
				x: +result.Attributes.x?.N,
				y: +result.Attributes.y?.N,
				z: +result.Attributes.z?.N,
				accuracy: +result.Attributes.accuracy?.N,
				measurementId: result.Attributes.measurementId.S,
				updatedAt: result.Attributes.updatedAt.S,
			};
		} catch (error) {
			console.log(error);
			throw "Error updating point";
		}
	}

	public async findOne(id: string): Promise<Point> {
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
			const result: GetItemCommandOutput = await this.dynamoDb.send(command);
			return {
				id: result.Item.id?.S,
				x: +result.Item.x?.N,
				y: +result.Item.y?.N,
				z: +result.Item.z?.N,
				accuracy: +result.Item.accuracy?.N,
				measurementId: result.Item.measurementId.S,
				createdAt: result.Item.createdAt.S,
				updatedAt: result.Item.updatedAt.S
			};
		} catch (error) {
			console.log(error);
			throw "Error finding point";
		}
	}
}
