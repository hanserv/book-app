import appContext from '../context/AppContext.js';
import {addBooksCount} from '../utils/book-count-helper.js';

const NAME_MAX_LENGTH = 100;
const EMAIL_MAX_LENGTH = 150;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateAuthorForm = (name, email) => {
	const errors = [];

	if (!name) {
		errors.push('The name is required.');
	} else if (name.length > NAME_MAX_LENGTH) {
		errors.push(`The name cannot exceed ${NAME_MAX_LENGTH} characters.`);
	}

	if (!email) {
		errors.push('The email is required.');
	} else if (email.length > EMAIL_MAX_LENGTH) {
		errors.push(`The email cannot exceed ${EMAIL_MAX_LENGTH} characters.`);
	} else if (!EMAIL_PATTERN.test(email)) {
		errors.push('The email is not valid.');
	}

	return errors;
};

export const getIndex = async (req, res, next) => {
	try {
		const authors = await appContext.Authors.findAll({
			order: [['name', 'ASC']],
			raw: true,
		});
		const authorList = await addBooksCount(authors, 'authorId');

		res.render('author/index', {
			pageTitle: 'Authors',
			authorList,
			hasAuthors: authorList.length > 0,
		});
	} catch (error) {
		next(error);
	}
};

export const getCreate = (req, res, next) => {
	res.render('author/create', {
		pageTitle: 'New author',
	});
};

export const postCreate = async (req, res, next) => {
	try {
		const name = req.body.name?.trim();
		const email = req.body.email?.trim();

		const errors = validateAuthorForm(name, email);

		if (errors.length > 0) {
			return res.render('author/create', {
				pageTitle: 'New author',
				errors,
				author: {
					name,
					email,
				},
			});
		}

		await appContext.Authors.create({name, email});
		res.redirect('/authors/index');
	} catch (error) {
		next(error);
	}
};

export const getEdit = async (req, res, next) => {
	try {
		const author = await appContext.Authors.findByPk(req.params.id, {
			raw: true,
		});

		if (!author) return res.redirect('/authors/index');

		res.render('author/edit', {
			pageTitle: `Edit author ${author.name}`,
			author,
		});
	} catch (error) {
		next(error);
	}
};

export const postEdit = async (req, res, next) => {
	try {
		const id = req.body.id;
		const name = req.body.name?.trim();
		const email = req.body.email?.trim();

		const errors = validateAuthorForm(name, email);

		if (errors.length > 0) {
			return res.render('author/edit', {
				pageTitle: 'Edit author',
				errors,
				author: {
					id,
					name,
					email,
				},
			});
		}

		await appContext.Authors.update({name, email}, {where: {id: id}});
		res.redirect('/authors/index');
	} catch (error) {
		next(error);
	}
};

export const getDelete = async (req, res, next) => {
	try {
		const author = await appContext.Authors.findByPk(req.params.id, {
			raw: true,
		});

		if (!author) return res.redirect('/authors/index');

		const booksCount = await appContext.Books.count({
			where: {authorId: author.id},
		});

		res.render('author/delete', {
			pageTitle: 'Delete author',
			author,
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

		const booksCount = await appContext.Books.count({where: {authorId: id}});

		if (booksCount > 0) return res.redirect(`/authors/delete/${id}`);

		await appContext.Authors.destroy({where: {id: id}});
		res.redirect('/authors/index');
	} catch (error) {
		next(error);
	}
};
