import Borrower from '../models/borrower_loan.js'
import moment from 'moment'

export const getBorrowerDetails = async (req, res) => {
    try{
        const borrowerDetails = await Borrower.findOne({ user: req.userId })
        if(!borrowerDetails){
            const newBorrowerDetails = await Borrower.create({
                user: req.userId,
                borrowerList: [],
                loans: []
            })
            res.status(200).json({borrowerDetails: newBorrowerDetails, activeLoans: [], completedLoans: []})
        }
        else{
            let activeLoans=[], completedLoans=[]
            let activeAmount=0, activeTotal=0
            let completedAmount=0, completedTotal=0
            borrowerDetails.loans.map(loan=>{
                if(loan.status==='active'){
                    activeLoans.push(loan)
                    activeAmount+=loan.amount
                    activeTotal+=loan.total
                }
                else{
                    completedLoans.push(loan)
                    completedAmount+=loan.amount
                    completedTotal+=loan.total
                }
            })
            res.status(200).json({borrowerDetails, activeLoans:{
                loans: activeLoans,
                activeAmount,
                activeTotal: activeTotal.toFixed(2)
            }, completedLoans:{
                loans: completedLoans,
                completedAmount,
                completedTotal: completedTotal.toFixed(2)
            }})
        }
    } catch(error){
        console.log(error)
        res.status(500).json({ message: 'Something Went Wrong' })
    }
}

export const postBorrowerName = async (req, res) => {
    const body = req.body
    try{
        const borrowerDetails = await Borrower.findOne({ user: req.userId })
        if(!borrowerDetails) return res.status(404).json({ message: 'Can not find user borrower details' })
        if(borrowerDetails.borrowerList.includes(body.newBorrowerName)) return res.status(400).json({ message: 'Borrower Name Already Exists' })
        borrowerDetails.borrowerList.push(body.newBorrowerName)
        borrowerDetails.save()
        res.status(200).json(borrowerDetails)
    } catch(error){
        console.log(error)
        res.status(500).json({ message: 'Something Went Wrong' })
    }
}

export const postBorrowerLoan = async (req, res) => {
    const body = req.body
    try{
        const borrowerDetails = await Borrower.findOne({ user: req.userId })
        if(!borrowerDetails) return res.status(404).json({ message: 'Can not find user borrower details' })
        let duration = moment(body.endDate).diff(moment(body.startDate), 'months')
        let total = parseFloat(body.amount)+parseFloat((body.amount*body.intrest*(duration/12)/100))
        let newLoan
        if(body.status==='active'){
            newLoan={
                name: body.name,
                startDate: body.startDate,
                endDate: body.endDate,
                amount: body.amount,
                intrest: body.intrest,
                paid: body.paid,
                status: body.status,
                total: total.toFixed(2)
            }
        }
        else{
            newLoan={
                name: body.name,
                startDate: body.startDate,
                endDate: body.endDate,
                amount: body.amount,
                intrest: body.intrest,
                paid: total.toFixed(2),
                status: body.status,
                total: total.toFixed(2)
            }
        }
        borrowerDetails.loans.push(newLoan)
        borrowerDetails.save()
        res.status(200).json({message: 'Borrower Loan Added!'})
    } catch(error){
        console.log(error)
        res.status(500).json({ message: 'Something Went Wrong' })
    }
}

export const editBorrowerLoan = async (req, res) => {

    const body = req.body
    let pos
    try{
        const lenderDetails = await Borrower.findOne({ user: req.userId })
        if(!lenderDetails) return res.status(404).json({ message: 'Can not find user lender details' })
        let duration = moment(body.endDate).diff(moment(body.startDate), 'months')
        let total = parseFloat(body.amount)+parseFloat((body.amount*body.intrest*(duration/12)/100))
        let newLoan
        if(body.status==='active'){
            newLoan={
                name: body.name,
                startDate: body.startDate,
                endDate: body.endDate,
                amount: body.amount,
                intrest: body.intrest,
                paid: body.paid,
                status: body.status,
                total: total.toFixed(2)
            }
        }
        else{
            newLoan={
                name: body.name,
                startDate: body.startDate,
                endDate: body.endDate,
                amount: body.amount,
                intrest: body.intrest,
                paid: total.toFixed(2),
                status: body.status,
                total: total.toFixed(2)
            }
        }
        lenderDetails.loans.map((loan,i)=>{
            if(body.id.toString()===loan._id.toString()){
                pos=i
            }
        })
        lenderDetails.loans.splice(pos, 1, newLoan)
        lenderDetails.save()
        res.status(200).json({message: 'Borrower Loan Edited!'})
    } catch(error){
        console.log(error)
        res.status(500).json({ message: 'Something Went Wrong' })
    }
}

export const deleteBorrowerLoan = async (req, res) => {

    const id = req.params.loanId
    try{
        const lenderDetails = await Borrower.findOne({ user: req.userId })
        if(!lenderDetails) return res.status(404).json({ message: 'Can not find user lender details' })
        let pos
        lenderDetails.loans.map((loan,i)=>{
            if(id.toString()===loan._id.toString()){
                pos=i
            }
        })        
        lenderDetails.loans.splice(pos, 1)
        lenderDetails.save()
        res.status(200).json({message: 'Borrower Loan Deleted!'})
    } catch(error){
        console.log(error)
        res.status(500).json({ message: 'Something Went Wrong' })
    }
}