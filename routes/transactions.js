import express from 'express';
import { auth } from '../middleware/auth.js'
import { getTransactionsDashboard, getTransactionHistory, addNewTransaction, editTransaction, deleteTransaction, getCategoryTransaction }  from '../controller/transactions.js';

const router = express.Router();

router.get('/getTransactionsDashboard', auth, getTransactionsDashboard)
router.get('/getTransactionHistory', auth, getTransactionHistory)
router.get('/getCategoryTransaction/:categoryName', auth, getCategoryTransaction)
router.post('/addNewTransaction', auth, addNewTransaction)
router.put('/editTransaction', auth, editTransaction)
router.delete('/deleteTransaction/:transactionId', auth, deleteTransaction)

export default router;