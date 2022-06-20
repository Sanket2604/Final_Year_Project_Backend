import express from 'express';
import { auth } from '../middleware/auth.js'
import { getStockInvestment, getStockSpecificInvestment, postStockInvestment, editStockInvestment, deleteStockInvestment }  from '../controller/stock.js';

const router = express.Router();

router.get('/getStockInvestment', auth, getStockInvestment)
router.get('/getStockSpecificInvestment/:stockId', auth, getStockSpecificInvestment)
router.post('/postStockInvestment', auth, postStockInvestment)
router.put('/editStockInvestment', auth, editStockInvestment)
router.delete('/deleteStockInvestment/:invstId', auth, deleteStockInvestment)

export default router;