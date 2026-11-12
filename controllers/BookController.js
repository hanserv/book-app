import appContext from '../context/AppContext.js';

const TITLE_MAX_LENGTH = 200;
const COVER_URL_MAX_LENGTH = 500;
const MIN_YEAR = 1000;
const URL_PATTERN = /^https?:\/\/\S+$/i;

const parseNumber = (text) => {
	if (text === undefined || text === null || String(text).trim() === '') {
		return null;
	}

	const number = Number(text);
	return Number.isNaN(number) ? null : number;
};

const getFormLists = async () => {
	const findAll = (model) =>
		model.findAll({order: [['name', 'DESC']], raw: true});

	const categoryList = await findAll(appContext.Categories);
	const authorList = await findAll(appContext.Authors);
	const publisherList = await findAll(appContext.Publishers);

	const missingData = [];

	if (categoryList.length === 0) {
		missingData.push({
			message: 'There are no categories created.',
			href: '/categories/create',
			linkText: 'Create a category',
		});
	}
	if (authorList.length === 0) {
		missingData.push({
			message: 'There are no authors created.',
			href: '/authors/create',
			linkText: 'Create an author',
		});
	}
	if (publisherList.length === 0) {
		missingData.push({
			message: 'There are no publishers created.',
			href: '/publishers/create',
			linkText: 'Create a publisher',
		});
	}

	return {
		categoryList,
		authorList,
		publisherList,
		missingData: missingData.length > 0 ? missingData : null,
	};
};

const readBookForm = (body) => ({
	title: body.title?.trim(),
	yearText: body.year?.trim(),
	year: parseNumber(body.year),
	coverUrl: body.coverUrl?.trim(),
	categoryId: parseNumber(body.categoryId),
	authorId: parseNumber(body.authorId),
	publisherId: parseNumber(body.publisherId),
});

const validateBookForm = (form, lists, isCoverRequired) => {
	const errors = [];
	const currentYear = new Date().getFullYear();

	if (!form.title) {
		errors.push('The title is required.');
	} else if (form.title.length > TITLE_MAX_LENGTH) {
		errors.push(`The title cannot exceed ${TITLE_MAX_LENGTH} characters.`);
	}

	if (form.year === null) {
		errors.push('The publication year is required.');
	} else if (
		!Number.isInteger(form.year) ||
		form.year < MIN_YEAR ||
		form.year > currentYear
	) {
		errors.push(
			`The year must be an integer between ${MIN_YEAR} and ${currentYear}.`,
		);
	}

	if (!form.coverUrl) {
		if (isCoverRequired) errors.push('The cover URL is required.');
	} else if (form.coverUrl.length > COVER_URL_MAX_LENGTH) {
		errors.push(
			`The cover URL cannot exceed ${COVER_URL_MAX_LENGTH} characters.`,
		);
	} else if (!URL_PATTERN.test(form.coverUrl)) {
		errors.push('The cover URL must start with http:// or https://.');
	}

	if (form.categoryId === null) {
		errors.push('The category is required.');
	} else if (
		!lists.categoryList.some((category) => category.id === form.categoryId)
	) {
		errors.push('The selected category does not exist.');
	}

	if (form.authorId === null) {
		errors.push('The author is required.');
	} else if (!lists.authorList.some((author) => author.id === form.authorId)) {
		errors.push('The selected author does not exist.');
	}

	if (form.publisherId === null) {
		errors.push('The publisher is required.');
	} else if (
		!lists.publisherList.some((publisher) => publisher.id === form.publisherId)
	) {
		errors.push('The selected publisher does not exist.');
	}

	return errors;
};

export const getIndex = async (req, res, next) => {
	try {
		const books = await appContext.Books.findAll({
			include: [
				appContext.Categories,
				appContext.Authors,
				appContext.Publishers,
			],
			order: [['title', 'DESC']],
			raw: true,
			nest: true,
		});

		res.render('book/index', {
			pageTitle: 'Books',
			bookList: books,
			hasBooks: books.length > 0,
		});
	} catch (error) {
		next(error);
	}
};

export const getDetail = async (req, res, next) => {
	try {
		const book = await appContext.Books.findByPk(req.params.id, {
			include: [
				appContext.Categories,
				appContext.Authors,
				appContext.Publishers,
			],
			raw: true,
			nest: true,
		});

		if (!book) return res.redirect('/');

		res.render('book/detail', {
			pageTitle: book.title,
			book,
		});
	} catch (error) {
		next(error);
	}
};

export const getCreate = async (req, res, next) => {
	try {
		const lists = await getFormLists();

		res.render('book/create', {pageTitle: 'New book', ...lists});
	} catch (error) {
		next(error);
	}
};

export const postCreate = async (req, res, next) => {
	try {
		const lists = await getFormLists();

		if (lists.missingData) {
			return res.render('book/create', {pageTitle: 'New book', ...lists});
		}

		const form = readBookForm(req.body);
		const errors = validateBookForm(form, lists, true);

		if (errors.length > 0) {
			return res.render('book/create', {
				pageTitle: 'New book',
				...lists,
				errors,
				book: {...form, year: form.yearText},
			});
		}

		await appContext.Books.create({
			title: form.title,
			year: form.year,
			coverUrl: form.coverUrl,
			categoryId: form.categoryId,
			authorId: form.authorId,
			publisherId: form.publisherId,
		});
		res.redirect('/books/index');
	} catch (error) {
		next(error);
	}
};

export const getEdit = async (req, res, next) => {
	try {
		const book = await appContext.Books.findByPk(req.params.id, {
			raw: true,
		});

		if (!book) return res.redirect('/books/index');

		const lists = await getFormLists();

		res.render('book/edit', {
			pageTitle: `Edit book ${book.title}`,
			...lists,
			book,
			currentCoverUrl: book.coverUrl,
		});
	} catch (error) {
		next(error);
	}
};

export const postEdit = async (req, res, next) => {
	try {
		const id = Number(req.body.id);
		const existingBook = await appContext.Books.findByPk(id, {
			raw: true,
		});

		if (!existingBook) return res.redirect('/books/index');

		const lists = await getFormLists();

		if (lists.missingData) {
			return res.render('book/edit', {
				pageTitle: 'Edit book',
				...lists,
				book: existingBook,
				currentCoverUrl: existingBook.coverUrl,
			});
		}

		const form = readBookForm(req.body);
		const errors = validateBookForm(form, lists, false);

		if (errors.length > 0) {
			return res.render('book/edit', {
				pageTitle: 'Edit book',
				...lists,
				errors,
				book: {id, ...form, year: form.yearText},
				currentCoverUrl: existingBook.coverUrl,
			});
		}

		await appContext.Books.update(
			{
				title: form.title,
				year: form.year,
				coverUrl: form.coverUrl || existingBook.coverUrl,
				categoryId: form.categoryId,
				authorId: form.authorId,
				publisherId: form.publisherId,
			},
			{where: {id: id}},
		);
		res.redirect('/books/index');
	} catch (error) {
		next(error);
	}
};

export const getDelete = async (req, res, next) => {
	try {
		const book = await appContext.Books.findByPk(req.params.id, {
			raw: true,
		});

		if (!book) return res.redirect('/books/index');

		res.render('book/delete', {pageTitle: 'Delete book', book});
	} catch (error) {
		next(error);
	}
};

export const postDelete = async (req, res, next) => {
	try {
		await appContext.Books.destroy({where: {id: req.body.id}});
		res.redirect('/books/index');
	} catch (error) {
		next(error);
	}
};
