import {handler} from "./measurement.index";

module.exports = {
	create: handler.create,
	findAll: handler.findAll,
	remove: handler.remove,
	update: handler.update,
	findOne: handler.findOne,
};
