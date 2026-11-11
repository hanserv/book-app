import path from 'path';
import {Sequelize} from 'sequelize';
import {projectRoot} from '../utils/paths.js';
import {databaseConfig} from './environment.js';

let connection;

if (databaseConfig.dialect === 'sqlite') {
	connection = new Sequelize({
		dialect: 'sqlite',
		storage: path.join(projectRoot, databaseConfig.storage),
	});
} else if (databaseConfig.dialect === 'mysql') {
	connection = new Sequelize(
		databaseConfig.database,
		databaseConfig.username,
		databaseConfig.password,
		{
			dialect: 'mysql',
			host: databaseConfig.host,
			port: databaseConfig.port,
		},
	);
} else {
	throw new Error(`Unsupported DB_DIALECT: ${databaseConfig.dialect}`);
}

export default connection;
