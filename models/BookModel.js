import {DataTypes} from 'sequelize';
import sequelize from '../config/connection.js';

const Book = sequelize.define(
	'Book',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		title: {
			type: DataTypes.STRING(200),
			allowNull: false,
		},
		year: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		coverUrl: {
			type: DataTypes.STRING(500),
			allowNull: true,
		},
		categoryId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'categories',
				key: 'id',
			},
			onDelete: 'RESTRICT',
			onUpdate: 'CASCADE',
		},
		authorId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'authors',
				key: 'id',
			},
			onDelete: 'RESTRICT',
			onUpdate: 'CASCADE',
		},
		publisherId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'publishers',
				key: 'id',
			},
			onDelete: 'RESTRICT',
			onUpdate: 'CASCADE',
		},
	},
	{
		tableName: 'books',
	},
);

export default Book;
