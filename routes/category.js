import express from 'express';
import { auth } from '../middleware/auth.js'
import { getCategoryList, addNewCategory, editCategory, deleteCategory }  from '../controller/category.js';

const router = express.Router();

router.get('/getCategoryList', auth, getCategoryList)
router.post('/addNewCategory', auth, addNewCategory)
router.put('/editCategory', auth, editCategory)
router.delete('/deleteCategory/:catId', auth, deleteCategory)

export default router;