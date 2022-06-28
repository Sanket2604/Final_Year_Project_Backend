import Lender from '../models/lender_loan.js'
import moment from 'moment'

export const getLenderDetails = async (req, res) => {
    try{
        const lenderDetails = await Lender.findOne({ user: req.userId })
        if(!lenderDetails){
            const newLenderDetails = await Lender.create({
                user: req.userId,
                lenderList: [],
                loans: []
            })
            res.status(200).json({lenderDetails: newLenderDetails, activeLoans: [], completedLoans: []})
        }
        else{
            let activeLoans=[], completedLoans=[]
            let activeAmount=0, activeTotal=0
            let completedAmount=0, completedTotal=0
            lenderDetails.loans.map(loan=>{
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
            res.status(200).json({lenderDetails, activeLoans:{
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

export const postLenderName = async (req, res) => {
    const body = req.body
    try{
        const lenderDetails = await Lender.findOne({ user: req.userId })
        if(!lenderDetails) return res.status(404).json({ message: 'Can not find user lender details' })
        if(lenderDetails.lenderList.includes(body.newLenderName)) return res.status(400).json({ message: 'Lender Name Already Exists' })
        lenderDetails.lenderList.push(body.newLenderName)
        lenderDetails.save()
        res.status(200).json(lenderDetails)
    } catch(error){
        console.log(error)
        res.status(500).json({ message: 'Something Went Wrong' })
    }
}

export const postLenderLoan = async (req, res) => {
    const body = req.body
    try{
        const lenderDetails = await Lender.findOne({ user: req.userId })
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
        lenderDetails.loans.push(newLoan)
        lenderDetails.save()
        res.status(200).json({message: 'Lender Loan Added!'})
    } catch(error){
        console.log(error)
        res.status(500).json({ message: 'Something Went Wrong' })
    }
}

export const editLenderLoan = async (req, res) => {

    const body = req.body
    let pos
    try{
        const lenderDetails = await Lender.findOne({ user: req.userId })
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
        res.status(200).json({message: 'Lender Loan Edited!'})
    } catch(error){
        console.log(error)
        res.status(500).json({ message: 'Something Went Wrong' })
    }
}

export const deleteLenderLoan = async (req, res) => {

    const id = req.params.loanId
    try{
        const lenderDetails = await Lender.findOne({ user: req.userId })
        if(!lenderDetails) return res.status(404).json({ message: 'Can not find user lender details' })
        let pos
        lenderDetails.loans.map((loan,i)=>{
            if(id.toString()===loan._id.toString()){
                pos=i
            }
        })
        lenderDetails.loans.splice(pos, 1)
        lenderDetails.save()
        res.status(200).json({message: 'Lender Loan Deleted!'})
    } catch(error){
        console.log(error)
        res.status(500).json({ message: 'Something Went Wrong' })
    }
}