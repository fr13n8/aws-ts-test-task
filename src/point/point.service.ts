import {Point, PointsList} from "./point.interfaces";
import {PointRepository} from "./point.repository";
import axios from "axios";
import {CALCULATIONS_API} from "../config/config";

export class PointService {
	constructor(private readonly repository: PointRepository) {}

	public async create(measurementId: string, body: PointsList): Promise<PointsList> {
		try {
			return await this.repository.create(measurementId, body);
		} catch (e) {
			console.log(e);
			throw e;
		}
	}

	public async findAll(measurementId: string): Promise<PointsList> {
		try {
			return await this.repository.findAll(measurementId);
		} catch (e) {
			console.log(e);
			throw e;
		}
	}

	public async remove(id: string): Promise<boolean> {
		try {
			return await this.repository.remove(id);
		} catch (e) {
			console.log(e);
			throw e;
		}
	}

	public async update(id: string, body: Point) {
		try {
			return await this.repository.update(id, body);
		} catch (e) {
			console.log(e);
			throw e;
		}
	}

	public async findOne(id: string): Promise<Point> {
		try {
			return await this.repository.findOne(id);
		} catch (e) {
			console.log(e);
			throw e;
		}
	}

	public async getPointsDistance(firstPointId: string, secondPointId: string): Promise<number> {
		try {
			const firstPoint = await this.repository.findOne(firstPointId);
			const secondPoint = await this.repository.findOne(secondPointId);
			if (!firstPoint || !secondPoint) {
				return null;
			}

			const data = [
				{
					x: firstPoint.x,
					y: firstPoint.y,
					z: firstPoint.z,
					accuracy: firstPoint.accuracy,
				},
				{
					x: secondPoint.x,
					y: secondPoint.y,
					z: secondPoint.z,
					accuracy: secondPoint.accuracy,
				}
			]

			const result = await axios.post(`${CALCULATIONS_API}/distance`, data, {
				headers: {
					'Content-Type': 'application/json',
					"Access-Control-Allow-Origin": "*",
				}
			})
			if (result.status !== 200) {
				return null;
			}

			return result.data.distance;
		} catch (error) {
			return null;
		}
	}

	public async getPointsLength(measurementId: string): Promise<number> {
		try {
			const points = await this.repository.findAll(measurementId);
			if (!points) {
				return null;
			}

			const data = points.map(point => ({
				x: point.x,
				y: point.y,
				z: point.z,
				accuracy: point.accuracy,
			}));

			const result = await axios.post(`${CALCULATIONS_API}/distance`, data, {
				headers: {
					'Content-Type': 'application/json',
					"Access-Control-Allow-Origin": "*",
				}
			})
			if (result.status !== 200) {
				return null;
			}

			return result.data.distance;
		} catch (error) {
			return null;
		}
	}

	public async getPointsArea(measurementId: string): Promise<number> {
		try {
			const points = await this.repository.findAll(measurementId);
			if (!points) {
				return null;
			}

			const data = points.map(point => ({
				x: point.x,
				y: point.y,
				z: point.z,
				accuracy: point.accuracy,
			}));

			const result = await axios.post(`${CALCULATIONS_API}/area`, data, {
				headers: {
					'Content-Type': 'application/json',
					"Access-Control-Allow-Origin": "*",
				}
			})
			if (result.status !== 200) {
				return null;
			}

			return result.data.area;
		} catch (error) {
			return null;
		}
	}
}
