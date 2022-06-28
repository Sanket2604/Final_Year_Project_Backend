import express from 'express';
import { auth } from '../middleware/auth.js'
import { getMainDashboard, login, signup, editMonthlyIncome }  from '../controller/account.js';

const router = express.Router();

router.get('/getMainDashboard', auth, getMainDashboard)
router.post('/login', login)
router.post('/signup', signup)
router.put('/editMonthlyIncome', auth, editMonthlyIncome)

export default router;