import appContext from '../context/AppContext.js';

export const addBooksCount = async (items, foreignKey) => {
	const counts = await appContext.Books.count({group: [foreignKey]});

	const countById = new Map(counts.map((row) => [row[foreignKey], row.count]));

	return items.map((item) => ({
		...item,
		booksCount: countById.get(item.id) ?? 0,
	}));
};
