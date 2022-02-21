import {APIGatewayEvent, APIGatewayProxyResult, Context, Handler} from "aws-lambda";
import {ResponseBuilder} from "../utils/responseGenerator";
import {MeasurementService} from "./measurement.service";

export class MeasurementController {
	private responseBuilder: ResponseBuilder;

	public constructor(private readonly measurementService: MeasurementService) {
		this.responseBuilder = new ResponseBuilder();
	}

	public findAll: Handler = async (_event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResult> => {
		try {
			const measurements = await this.measurementService.findAll();
			return this.responseBuilder.build(200, "success", measurements);
		} catch (error) {
			return this.responseBuilder.build(500, error.message, null);
		}
	};

	public create: Handler = async (event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResult> => {
		try {
			const input = JSON.parse(event.body);
			if (!input.name || typeof input.name !== "string") {
				return this.responseBuilder.build(422, "Invalid measurement", null);
			}
			const resp = await this.measurementService.create(input);
			return this.responseBuilder.build(200, "success", resp);
		} catch (error) {
			return this.responseBuilder.build(500, error.message, null);
		}
	};

	public remove: Handler = async (event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResult> => {
		try {
			const id = event.pathParameters.id;
			if (!id) {
				return this.responseBuilder.build(400, "Invalid id", null);
			}
			const resp = await this.measurementService.remove(id);
			if (resp) {
				return this.responseBuilder.build(200, "success", null);
			} else {
				return this.responseBuilder.build(404, "Measurement not found", null);
			}
		} catch (error) {
			return this.responseBuilder.build(500, error.message, null);
		}
	};

	public update: Handler = async (event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResult> => {
		try {
			const input = JSON.parse(event.body);
			if (!input.name || typeof input.name !== "string") {
				return this.responseBuilder.build(422, "Invalid measurement", null);
			}
			const id = event.pathParameters.id;
			if (!id) {
				return this.responseBuilder.build(400, "Invalid id", null);
			}
			const resp = await this.measurementService.update(id, input);
			return this.responseBuilder.build(200, "success", resp);
		} catch (error) {
			return this.responseBuilder.build(500, error.message, null);
		}
	};

	public async findOne(event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResult> {
		try {
			const id = event.pathParameters.id;
			if (!id) {
				return this.responseBuilder.build(400, "Invalid id", null);
			}
			const measurement = await this.measurementService.findOne(id);
			if (!measurement) {
				return this.responseBuilder.build(204, "Measurement not found", null);
			}
			return this.responseBuilder.build(200, "success", measurement);
		} catch (error) {
			return this.responseBuilder.build(500, error.message, null);
		}
	}
}
