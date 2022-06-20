import express from 'express';
import { auth } from '../middleware/auth.js'
import { getLenderDetails, postLenderName, postLenderLoan, editLenderLoan, deleteLenderLoan }  from '../controller/loan.js';
import { getBorrowerDetails, postBorrowerName, postBorrowerLoan, editBorrowerLoan, deleteBorrowerLoan }  from '../controller/borrower.js';

const router = express.Router();

router.get('/getLenderDetails', auth, getLenderDetails)
router.post('/postLenderName', auth, postLenderName)
router.post('/postLenderLoan', auth, postLenderLoan)
router.put('/editLenderLoan', auth, editLenderLoan)
router.delete('/deleteLenderLoan/:loanId', auth, deleteLenderLoan)

router.get('/getBorrowerDetails', auth, getBorrowerDetails)
router.post('/postBorrowerName', auth, postBorrowerName)
router.post('/postBorrowerLoan', auth, postBorrowerLoan)
router.put('/editBorrowerLoan', auth, editBorrowerLoan)
router.delete('/deleteBorrowerLoan/:loanId', auth, deleteBorrowerLoan)

export default router;