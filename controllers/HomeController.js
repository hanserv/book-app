import {Op} from 'sequelize';
import appContext from '../context/AppContext.js';

const parseCategoryIds = (value) => {
	const values = Array.isArray(value) ? value : value ? [value] : [];
	return values.map(Number).filter(Number.isInteger);
};

export const getIndex = async (req, res, next) => {
	try {
		const title = req.query.title?.trim() ?? '';
		const selectedCategoryIds = parseCategoryIds(req.query.categoryId);

		const where = {};

		if (title) where.title = {[Op.like]: `%${title}%`};
		if (selectedCategoryIds.length > 0) {
			where.categoryId = {[Op.in]: selectedCategoryIds};
		}

		const books = await appContext.Books.findAll({
			where,
			include: [
				appContext.Categories,
				appContext.Authors,
				appContext.Publishers,
			],
			order: [['title', 'ASC']],
			raw: true,
			nest: true,
		});

		const categories = await appContext.Categories.findAll({
			order: [['name', 'ASC']],
			raw: true,
		});

		const categoryList = categories.map((category) => ({
			...category,
			isSelected: selectedCategoryIds.includes(category.id),
		}));

		res.render('home/index', {
			pageTitle: 'Home',
			bookList: books,
			hasBooks: books.length > 0,
			categoryList,
			hasCategories: categoryList.length > 0,
			title,
			hasFilters: title !== '' || selectedCategoryIds.length > 0,
		});
	} catch (error) {
		next(error);
	}
};
