import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import Borrower from '../models/borrower_loan.js'
import Lender from '../models/lender_loan.js'
import Crypto from '../models/crypto.js'
import Stock from '../models/stock.js'


export const getMainDashboard = async (req, res) => {

    try {
        let BorrowerLoanTotal=0, LenderLoanTotal=0, CryptoTotal=0, StockTotal=0
        let BorrowerLoanList=[], LenderLoanList=[], CryptoList=[], StockList=[]
        const userData = await User.findOne({ user: req.userId });
        const BorrowerLoan = await Borrower.findOne({ user: req.userId });
        const LenderLoan = await Lender.findOne({ user: req.userId });
        const CryptoInvst = await Crypto.findOne({ user: req.userId });
        const StockInvst = await Stock.findOne({ user: req.userId });

        BorrowerLoan.loans.map(loan=>{
            if(loan.status==='active'){
                BorrowerLoanList.push(loan)
                BorrowerLoanTotal+=loan.total
            }
        })
        LenderLoan.loans.map(loan=>{
            if(loan.status==='active'){
                LenderLoanList.push(loan)
                LenderLoanTotal+=loan.total
            }
        })
        CryptoInvst.investments.map(invst => {
            if (invst.status === 'active') {
                CryptoList.push(invst)
                CryptoTotal += invst.investment
            }
        })
        StockInvst.investments.map(invst => {
            if (invst.status === 'active') {
                StockList.push(invst)
                StockTotal += invst.investment
            }
        })

        res.status(200).json({
            income: userData.monthlyIncome, 
            borrow: {
                list: BorrowerLoanList,
                total: BorrowerLoanTotal
            },
            loan: {
                list: LenderLoanList,
                total: LenderLoanTotal
            },
            crypto: {
                list: CryptoList,
                total: CryptoTotal
            },
            stock: {
                list: StockList,
                total: StockTotal
            }
        })
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong '})
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if(!existingUser) return res.status(404).json({ message: "User doesn't exist" })

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)

        if(!isPasswordCorrect) return res.status(400).json({ message: "Invalid Credential" })

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'YourMoneyMatters', { expiresIn: 2189229120000})

        res.status(200).json({ token })
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong '})
    }
}

export const signup = async (req, res) => {
    const { fullname, email, password, rePassword, monthlyIncome } = req.body;
    const emailPattern = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i

    try{
        if(!emailPattern.test(email)) return res.status(400).json({ message: "Invalid Email" })
        const existingEmail = await User.findOne({ email });
        if(existingEmail) return res.status(400).json({ message: "Email Id already exists" })
        if(password.length<6) return res.status(400).json({ message: "Password should be greater than 6 charecters." })
        if(password !== rePassword) return res.status(400).json({ message: "Passwords don't match." })
        const hashedPassword = await bcrypt.hash(password, 12);
        const result = await User.create({ 
            fullname, 
            email, 
            password: hashedPassword, 
            monthlyIncome
        })
        const token = jwt.sign({ email: result.email, id: result._id }, 'YourMoneyMatters', { expiresIn: 2189229120000 })
        res.status(200).json({ token })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Something went wrong '})
    }
}

export const editMonthlyIncome = async (req, res) => {

    try{
        const userData = await User.findOne({ user: req.userId });
        userData.monthlyIncome=req.body.income
        userData.save()
        res.status(200).json({ message: 'Monthly Income Updated'})
    }
    catch(error){
        console.log(error)
        res.status(500).json({ message: 'Something went wrong'})
    }
}
