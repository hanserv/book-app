import {DataTypes} from 'sequelize';
import sequelize from '../config/connection.js';

const Publisher = sequelize.define(
	'Publisher',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		phone: {
			type: DataTypes.STRING(20),
			allowNull: false,
		},
		country: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
	},
	{
		tableName: 'publishers',
	},
);

export default Publisher;
