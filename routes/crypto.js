import express from 'express';
import { auth } from '../middleware/auth.js'
import { getCryptoInvestment, getCryptoSpecificInvestment, postCryptoInvestment, editCryptoInvestment, deleteCryptoInvestment }  from '../controller/crypto.js';

const router = express.Router();

router.get('/getCryptoInvestment', auth, getCryptoInvestment)
router.get('/getCryptoSpecificInvestment/:cryptoId', auth, getCryptoSpecificInvestment)
router.post('/postCryptoInvestment', auth, postCryptoInvestment)
router.put('/editCryptoInvestment', auth, editCryptoInvestment)
router.delete('/deleteCryptoInvestment/:invstId', auth, deleteCryptoInvestment)

export default router;