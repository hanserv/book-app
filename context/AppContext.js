import sequelize from '../config/connection.js';
import {environment} from '../config/environment.js';
import Category from '../models/CategoryModel.js';
import Author from '../models/AuthorModel.js';
import Publisher from '../models/PublisherModel.js';
import Book from '../models/BookModel.js';

Category.hasMany(Book, {foreignKey: 'categoryId'});
Book.belongsTo(Category, {foreignKey: 'categoryId'});

Author.hasMany(Book, {foreignKey: 'authorId'});
Book.belongsTo(Author, {foreignKey: 'authorId'});

Publisher.hasMany(Book, {foreignKey: 'publisherId'});
Book.belongsTo(Publisher, {foreignKey: 'publisherId'});

const connect = async () => {
	await sequelize.authenticate();
	await sequelize.sync();

	console.log(
		`Database connection OK (${environment}, ${sequelize.getDialect()})`,
	);
};

export default {
	sequelize,
	connect,
	Categories: Category,
	Authors: Author,
	Publishers: Publisher,
	Books: Book,
};
