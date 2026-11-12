import express from 'express';
import {
	getIndex,
	getCreate,
	postCreate,
	getEdit,
	postEdit,
	getDelete,
	postDelete,
} from '../controllers/AuthorController.js';

const router = express.Router();

// Author routes
router.get('/', (req, res) => res.redirect('/authors/index'));
router.get('/index', getIndex);

router.get('/create', getCreate);
router.post('/create', postCreate);

router.get('/edit/:id', getEdit);
router.post('/edit', postEdit);

router.get('/delete/:id', getDelete);
router.post('/delete', postDelete);

export default router;
