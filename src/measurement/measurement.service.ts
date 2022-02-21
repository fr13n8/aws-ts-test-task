import {Measurement, MeasurementList} from "./measurement.interfaces";
import {MeasurementRepository} from "./measurement.repository";
import {v4 as uuid4} from "uuid";

export class MeasurementService {
	constructor(private readonly repository: MeasurementRepository) {}

	public async create(body: Measurement) {
		const data: Measurement = {
			id: uuid4(),
			...body
		};
		return await this.repository.create(data);
	}

	public async findAll(): Promise<MeasurementList> {
		return await this.repository.findAll();
	}

	public async remove(id: string): Promise<boolean> {
		return await this.repository.remove(id);
	}

	public async update(id: string, body: Measurement) {
		return await this.repository.update(id, body);
	}

	public async findOne(id: string): Promise<Measurement> {
		return await this.repository.findOne(id);
	}
}
