import {DataTypes} from 'sequelize';
import sequelize from '../config/connection.js';

const Category = sequelize.define(
	'Category',
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
		description: {
			type: DataTypes.STRING(500),
			allowNull: false,
		},
	},
	{
		tableName: 'categories',
	},
);

export default Category;
