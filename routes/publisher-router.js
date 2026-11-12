import express from 'express';
import {
	getIndex,
	getCreate,
	postCreate,
	getEdit,
	postEdit,
	getDelete,
	postDelete,
} from '../controllers/PublisherController.js';

const router = express.Router();

// Publisher routes
router.get('/', (req, res) => res.redirect('/publishers/index'));
router.get('/index', getIndex);

router.get('/create', getCreate);
router.post('/create', postCreate);

router.get('/edit/:id', getEdit);
router.post('/edit', postEdit);

router.get('/delete/:id', getDelete);
router.post('/delete', postDelete);

export default router;
