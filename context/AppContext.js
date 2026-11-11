import sequelize from '../config/connection.js';
import {environment} from '../config/environment.js';

const connect = async () => {
	await sequelize.authenticate();
	await sequelize.sync({alter: true});

	console.log(
		`Database connection OK (${environment}, ${sequelize.getDialect()})`,
	);
};

export default {
	sequelize,
	connect,
};
