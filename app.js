import express from 'express';
import {engine} from 'express-handlebars';
import path from 'path';
import {port, environment} from './config/environment.js';
import appContext from './context/AppContext.js';
import {projectRoot} from './utils/paths.js';
import homeRoutes from './routes/home-router.js';
import categoryRoutes from './routes/category-router.js';

const app = express();

// render engine
app.engine(
	'hbs',
	engine({
		layoutsDir: 'views/layouts',
		defaultLayout: 'layout',
		extname: 'hbs',
		helpers: {
			eq: (a, b) => a === b,
			isActive: (currentPath, section) => {
				if (section === 'home') return currentPath === '/';
				return currentPath.startsWith(`/${section}`);
			},
		},
	}),
);

app.set('view engine', 'hbs');
app.set('views', 'views');

// middlewares
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(projectRoot, 'public')));

// makes the current path available to every view, we use it to highlight the navbar
app.use((req, res, next) => {
	res.locals.currentPath = req.path;
	next();
});

// routes
app.use(homeRoutes);
app.use('/categories', categoryRoutes);

// 404
app.use((req, res) => {
	res.status(404).render('404', {pageTitle: 'Page not found'});
});

// error handler
app.use((error, req, res, next) => {
	console.error(error);
	res.status(500).render('500', {pageTitle: 'Server error'});
});

//
try {
	await appContext.connect();

	app.listen(port, () => {
		console.log(`Server running on http://localhost:${port} (${environment})`);
	});
} catch (error) {
	console.error('Unable to connect to the database:', error.message);
	process.exit(1);
}
