import appContext from '../context/AppContext.js';

const NAME_MAX_LENGTH = 100;
const PHONE_MAX_LENGTH = 20;
const COUNTRY_MAX_LENGTH = 100;
const PHONE_PATTERN = /^[0-9+\-()\s]+$/;

const validatePublisherForm = (name, phone, country) => {
	const errors = [];

	if (!name) {
		errors.push('The name is required.');
	} else if (name.length > NAME_MAX_LENGTH) {
		errors.push(`The name cannot exceed ${NAME_MAX_LENGTH} characters.`);
	}

	if (!phone) {
		errors.push('The phone is required.');
	} else if (phone.length > PHONE_MAX_LENGTH) {
		errors.push(`The phone cannot exceed ${PHONE_MAX_LENGTH} characters.`);
	} else if (!PHONE_PATTERN.test(phone)) {
		errors.push(
			'The phone can only contain digits, spaces, +, - and parentheses.',
		);
	}

	if (!country) {
		errors.push('The country is required.');
	} else if (country.length > COUNTRY_MAX_LENGTH) {
		errors.push(`The country cannot exceed ${COUNTRY_MAX_LENGTH} characters.`);
	}

	return errors;
};

export const getIndex = async (req, res, next) => {
	try {
		const publishers = await appContext.Publishers.findAll({
			order: [['name', 'DESC']],
			raw: true,
		});

		res.render('publisher/index', {
			pageTitle: 'Publishers',
			publisherList: publishers,
			hasPublishers: publishers.length > 0,
		});
	} catch (error) {
		next(error);
	}
};

export const getCreate = (req, res, next) => {
	res.render('publisher/create', {
		pageTitle: 'New publisher',
	});
};

export const postCreate = async (req, res, next) => {
	try {
		const name = req.body.name?.trim();
		const phone = req.body.phone?.trim();
		const country = req.body.country?.trim();

		const errors = validatePublisherForm(name, phone, country);

		if (errors.length > 0) {
			return res.render('publisher/create', {
				pageTitle: 'New publisher',
				errors,
				publisher: {
					name,
					phone,
					country,
				},
			});
		}

		await appContext.Publishers.create({name, phone, country});
		res.redirect('/publishers/index');
	} catch (error) {
		next(error);
	}
};

export const getEdit = async (req, res, next) => {
	try {
		const publisher = await appContext.Publishers.findByPk(req.params.id, {
			raw: true,
		});

		if (!publisher) return res.redirect('/publishers/index');

		res.render('publisher/edit', {
			pageTitle: `Edit publisher ${publisher.name}`,
			publisher,
		});
	} catch (error) {
		next(error);
	}
};

export const postEdit = async (req, res, next) => {
	try {
		const id = req.body.id;
		const name = req.body.name?.trim();
		const phone = req.body.phone?.trim();
		const country = req.body.country?.trim();

		const errors = validatePublisherForm(name, phone, country);

		if (errors.length > 0) {
			return res.render('publisher/edit', {
				pageTitle: 'Edit publisher',
				errors,
				publisher: {
					id,
					name,
					phone,
					country,
				},
			});
		}

		await appContext.Publishers.update(
			{name, phone, country},
			{where: {id: id}},
		);
		res.redirect('/publishers/index');
	} catch (error) {
		next(error);
	}
};

export const getDelete = async (req, res, next) => {
	try {
		const publisher = await appContext.Publishers.findByPk(req.params.id, {
			raw: true,
		});

		if (!publisher) return res.redirect('/publishers/index');

		res.render('publisher/delete', {
			pageTitle: 'Delete publisher',
			publisher,
		});
	} catch (error) {
		next(error);
	}
};

export const postDelete = async (req, res, next) => {
	try {
		await appContext.Publishers.destroy({where: {id: req.body.id}});
		res.redirect('/publishers/index');
	} catch (error) {
		next(error);
	}
};
