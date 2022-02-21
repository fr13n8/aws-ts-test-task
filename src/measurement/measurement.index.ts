require('dotenv').config()
import { MeasurementController } from "./measurement.controller";
import { MeasurementService } from "./measurement.service";
import {MeasurementRepository} from "./measurement.repository";
import {createDynamoDBClient} from "../db/db";

const dynamoDb = createDynamoDBClient();
const repo: MeasurementRepository = new MeasurementRepository(dynamoDb);
const service: MeasurementService = new MeasurementService(repo);
const controller: MeasurementController = new MeasurementController(service);

export const handler = {
	create: controller.create.bind(controller),
	findAll: controller.findAll.bind(controller),
	remove: controller.remove.bind(controller),
	update: controller.update.bind(controller),
	findOne: controller.findOne.bind(controller),
};
