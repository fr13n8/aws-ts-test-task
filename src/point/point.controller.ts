import {APIGatewayEvent, APIGatewayProxyResult, Context, Handler} from "aws-lambda";
import {ResponseBuilder} from "../utils/responseGenerator";
import {PointService} from "./point.service";

export class PointController {
	private responseBuilder: ResponseBuilder;

	public constructor(private readonly pointService: PointService) {
		this.responseBuilder = new ResponseBuilder();
	}

	public findAll: Handler = async (event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResult> => {
		try {
			const measurementId = event.pathParameters.measurementId;
			if (!measurementId) {
				return this.responseBuilder.build(400,'Invalid id', null);
			}
			const points = await this.pointService.findAll(measurementId);

			return this.responseBuilder.build(200, "success", points);
		} catch (error) {
			return this.responseBuilder.build(500, "Server error", null);
		}
	};

	public create: Handler = async (event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResult> => {
		try {
			const measurementId = event.pathParameters?.measurementId;
			if (!measurementId) {
				return this.responseBuilder.build(400,'Invalid id', null);
			}
			const input = JSON.parse(event.body);
			if (PointController.validateInput(input)) {
				return this.responseBuilder.build(422,'Invalid input', null);
			}
			if (input.some(item => (!item.x && !isNaN(+item.x)) || (!item.y && !isNaN(item.y)) || (!item.z && !isNaN(item.z)))) {
				return this.responseBuilder.build(422,'Invalid input', null);
			}
			const resp = await this.pointService.create(measurementId, input);
			return this.responseBuilder.build(200, "success", resp);
		} catch (error) {
			return this.responseBuilder.build(500, "Server error", null);
		}
	};

	public remove: Handler = async (event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResult> => {
		try {
			const pointId = event.pathParameters.pointId;
			if (!pointId) {
				return this.responseBuilder.build(400,'Invalid id', null);
			}
			const resp = await this.pointService.remove(pointId);
			if (resp) {
				return this.responseBuilder.build(200, "success", null);
			} else {
				return this.responseBuilder.build(404, "Not found", null);
			}
		} catch (error) {
			return this.responseBuilder.build(500, "Server error", null);
		}
	};

	public update: Handler = async (event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResult> => {
		try {
			const pointId = event.pathParameters.pointId;
			if (!pointId) {
				return this.responseBuilder.build(400,'Invalid id', null);
			}
			const input = JSON.parse(event.body);
			if (PointController.validateInput(input)) {
				return this.responseBuilder.build(422,'Invalid input', null);
			}
			if ((!input.x && !isNaN(+input.x)) || (!input.y && !isNaN(input.y)) || (!input.z && !isNaN(input.z))) {
				return this.responseBuilder.build(422,'Invalid input', null);
			}
			const resp = await this.pointService.update(pointId, input);

			return this.responseBuilder.build(200, "success", resp);
		} catch (error) {
			return this.responseBuilder.build(500, "Server error", null);
		}
	};

	public async findOne(event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResult> {
		try {
			const pointId = event.pathParameters.pointId;
			if (!pointId) {
				return this.responseBuilder.build(400,'Invalid id', null);
			}
			const point = await this.pointService.findOne(pointId);
			if (!point) {
				return this.responseBuilder.build(204, 'Point not found', null);
			}

			return this.responseBuilder.build(200, "success", point);
		} catch (error) {
			return this.responseBuilder.build(500, "Server error", null);
		}
	}

	public async getPointsDistance(event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResult> {
		try {
			const firstPointId = event.queryStringParameters.firstPointId;
			const secondPointId = event.queryStringParameters.secondPointId;
			if (!firstPointId || !secondPointId) {
				return this.responseBuilder.build(400,'Invalid id', null);
			}
			const distance = await this.pointService.getPointsDistance(firstPointId, secondPointId);
			if (!distance) {
				return this.responseBuilder.build(204, 'Points not found', null);
			}

			return this.responseBuilder.build(200, "success", {distance});
		} catch (error) {
			return this.responseBuilder.build(500, "Server error", null);
		}
	}

	public async getPointsLength(event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResult> {
		try {
			const measurementId = event.pathParameters.measurementId;
			if (!measurementId) {
				return this.responseBuilder.build(400,'Invalid id', null);
			}
			const length = await this.pointService.getPointsLength(measurementId);
			if (!length) {
				return this.responseBuilder.build(204, 'Points not found', null);
			}

			return this.responseBuilder.build(200, "success", {length});
		} catch (error) {
			return this.responseBuilder.build(500, "Server error", null);
		}
	}

	public async getPointsArea(event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResult> {
		try {
			const measurementId = event.pathParameters.measurementId;
			if (!measurementId) {
				return this.responseBuilder.build(400,'Invalid id', null);
			}
			const area = await this.pointService.getPointsArea(measurementId);
			if (!area) {
				return this.responseBuilder.build(204, 'Points not found', null);
			}

			return this.responseBuilder.build(200, "success", {area});
		} catch (error) {
			return this.responseBuilder.build(500, "Server error", null);
		}
	}

	static validateInput(obj) {
		if (typeof obj === 'number') return false;
		else if (typeof obj === 'string') return obj.length === 0;
		else if (Array.isArray(obj)) return obj.length === 0;
		else if (typeof obj === 'object') return obj == null || Object.keys(obj).length === 0;
		else if (typeof obj === 'boolean') return false;
		else return !obj;
	}
}
