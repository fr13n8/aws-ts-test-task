import {handler} from './point.index';

module.exports = {
	create: handler.create,
	findAll: handler.findAll,
	remove: handler.remove,
	update: handler.update,
	findOne: handler.findOne,
	getPointsDistance: handler.getPointsDistance,
	getPointsLength: handler.getPointsLength,
	getPointsArea: handler.getPointsArea
};
