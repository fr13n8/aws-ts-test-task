require('dotenv').config()
import { PointController } from "./point.controller";
import { PointService } from "./point.service";
import {PointRepository} from "./point.repository";
import {createDynamoDBClient} from "../db/db";

const dynamoDb = createDynamoDBClient();
const repo: PointRepository = new PointRepository(dynamoDb);
const service: PointService = new PointService(repo);
const controller: PointController = new PointController(service);

export const handler = {
	create: controller.create.bind(controller),
	findAll: controller.findAll.bind(controller),
	remove: controller.remove.bind(controller),
	update: controller.update.bind(controller),
	findOne: controller.findOne.bind(controller),
	getPointsDistance: controller.getPointsDistance.bind(controller),
	getPointsLength: controller.getPointsLength.bind(controller),
	getPointsArea: controller.getPointsArea.bind(controller),
};
