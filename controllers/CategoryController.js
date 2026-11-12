import appContext from '../context/AppContext.js';
import {addBooksCount} from '../utils/book-count-helper.js';

const NAME_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 500;

const validateCategoryForm = (name, description) => {
	const errors = [];

	if (!name) {
		errors.push('The name is required.');
	} else if (name.length > NAME_MAX_LENGTH) {
		errors.push(`The name cannot exceed ${NAME_MAX_LENGTH} characters.`);
	}

	if (!description) {
		errors.push('The description is required.');
	} else if (description.length > DESCRIPTION_MAX_LENGTH) {
		errors.push(
			`The description cannot exceed ${DESCRIPTION_MAX_LENGTH} characters.`,
		);
	}

	return errors;
};

export const getIndex = async (req, res, next) => {
	try {
		const categories = await appContext.Categories.findAll({
			order: [['name', 'ASC']],
			raw: true,
		});
		const categoryList = await addBooksCount(categories, 'categoryId');

		res.render('category/index', {
			pageTitle: 'Categories',
			categoryList,
			hasCategories: categoryList.length > 0,
		});
	} catch (error) {
		next(error);
	}
};

export const getCreate = (req, res, next) => {
	res.render('category/create', {
		pageTitle: 'New category',
	});
};

export const postCreate = async (req, res, next) => {
	try {
		const name = req.body.name?.trim();
		const description = req.body.description?.trim();

		const errors = validateCategoryForm(name, description);

		if (errors.length > 0) {
			return res.render('category/create', {
				pageTitle: 'New category',
				errors,
				category: {
					name,
					description,
				},
			});
		}

		await appContext.Categories.create({name, description});
		res.redirect('/categories/index');
	} catch (error) {
		next(error);
	}
};

export const getEdit = async (req, res, next) => {
	try {
		const category = await appContext.Categories.findByPk(req.params.id, {
			raw: true,
		});

		if (!category) return res.redirect('/categories/index');

		res.render('category/edit', {
			pageTitle: `Edit category ${category.name}`,
			category,
		});
	} catch (error) {
		next(error);
	}
};

export const postEdit = async (req, res, next) => {
	try {
		const id = req.body.id;
		const name = req.body.name?.trim();
		const description = req.body.description?.trim();

		const errors = validateCategoryForm(name, description);

		if (errors.length > 0) {
			return res.render('category/edit', {
				pageTitle: 'Edit category',
				errors,
				category: {id, name, description},
			});
		}

		await appContext.Categories.update({name, description}, {where: {id: id}});
		res.redirect('/categories/index');
	} catch (error) {
		next(error);
	}
};

export const getDelete = async (req, res, next) => {
	try {
		const category = await appContext.Categories.findByPk(req.params.id, {
			raw: true,
		});

		if (!category) return res.redirect('/categories/index');

		const booksCount = await appContext.Books.count({
			where: {categoryId: category.id},
		});

		res.render('category/delete', {
			pageTitle: 'Delete category',
			category,
			booksCount,
			hasBooks: booksCount > 0,
		});
	} catch (error) {
		next(error);
	}
};

export const postDelete = async (req, res, next) => {
	try {
		const id = req.body.id;

		const booksCount = await appContext.Books.count({where: {categoryId: id}});

		if (booksCount > 0) return res.redirect(`/categories/delete/${id}`);

		await appContext.Categories.destroy({where: {id: id}});
		res.redirect('/categories/index');
	} catch (error) {
		next(error);
	}
};
