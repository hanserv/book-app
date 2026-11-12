import {DataTypes} from 'sequelize';
import sequelize from '../config/connection.js';

const Author = sequelize.define(
	'Author',
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
		email: {
			type: DataTypes.STRING(150),
			allowNull: false,
		},
	},
	{
		tableName: 'authors',
	},
);

export default Author;
