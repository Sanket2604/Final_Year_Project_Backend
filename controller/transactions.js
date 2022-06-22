import Transaction from '../models/transaction.js'
import Category from '../models/category.js'
import User from '../models/user.js'
import TransactionHistory from '../models/transactionHistory.js'
import moment from 'moment'

export const getTransactionsDashboard = async (req, res) => {
    try {
        const userData = await User.findOne({ user: req.userId });
        const userTransaction = await Transaction.findOne({ user: req.userId })
        const userCategory = await Category.findOne({ user: req.userId })
        const transactionHistory = await TransactionHistory.findOne({ user: req.userId })
        let response=[], newTransactions=[], expenditure=[], catTotal=[], label=[]
        if(!transactionHistory){
            TransactionHistory.create({
                user: req.userId,
                transactionHistory:[]
            })
        }
        if(!userTransaction){
            Transaction.create({
                user: req.userId,
                transactionList:[]
            })
        }
        if(!userCategory){
            Category.create({
                user: req.userId,
                categoryList:[{
                        name: 'Electronic Gadgets',
                        total: userData.monthlyIncome*12*0.1,
                        type: 'System'
                    },{
                        name: 'Clothing',
                        total: userData.monthlyIncome*12*0.05,
                        type: 'System'
                    },{
                        name: 'House Expenses',
                        total: userData.monthlyIncome*12*0.2,
                        type: 'System'
                    },{
                        name: 'Automobiles',
                        total: userData.monthlyIncome*12*0.08,
                        type: 'System'
                    },{
                        name: 'Grocery',
                        total: userData.monthlyIncome*12*0.12,
                        type: 'System'
                    },{
                        name: 'Memberships',
                        total: userData.monthlyIncome*12*0.05,
                        type: 'System'
                    },{
                        name: 'Savings',
                        total: userData.monthlyIncome*12*0.3,
                        type: 'System'
                    },{
                        name: 'Education',
                        total: userData.monthlyIncome*12*0.05,
                        type: 'System'
                    },{
                        name: 'Travel',
                        total: userData.monthlyIncome*12*0.15,
                        type: 'System'
                    }
                ]
            })
        }
        else{
            userCategory.categoryList.map(cat=>{
                let total=0
                let categoryTransactions=[]
                userTransaction?.transactionList.map(trans=>{
                    if(trans.categoryName===cat.name){
                        total+=trans.amount
                        categoryTransactions.push(trans)
                    }
                })
                expenditure.push(total)
                catTotal.push(cat.total)
                label.push(cat.name)
                response.push({
                    category: cat,
                    transactions: categoryTransactions,
                    total: total
                })
            })
            let length=userTransaction?.transactionList?.length-1
            for(let i=length;i>=length-10;i--){
                if(i>=0) {newTransactions.push(userTransaction?.transactionList[i])}
            }
        }
        res.status(200).json({
            categoryData: response,
            newTransactions,
            expenditure,
            catTotal,
            label
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Something Went Wrong' })
    }
}

export const getCategoryTransaction = async (req, res) => {
    const catName = req.params.categoryName
    try {
        const userTransaction = await Transaction.findOne({ user: req.userId })
        const userCategory = await Category.findOne({ user: req.userId })
        let specificCategory, categorySpecificTransaction=[], expenditure=0
        userCategory.categoryList.map(cat=>{
            if(cat.name===catName){
                specificCategory=cat
            }
        })
        userTransaction.transactionList.map(trans=>{
            if(trans.categoryName===catName){
                categorySpecificTransaction.push(trans)
                expenditure+=trans.amount
            }
        })
        res.status(200).json({specificCategory: specificCategory, specificTransaction: categorySpecificTransaction, expenditure})
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Something Went Wrong' })
    }
}

export const getTransactionHistory = async (req, res) => {
    try {
        const transactionHistory = await TransactionHistory.findOne({ user: req.userId })
        res.status(200).json(transactionHistory)
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Something Went Wrong' })
    }
}

export const addNewTransaction = async (req, res) => {
    const body = req.body
    let pos=-1
    try {
        const userTransaction = await Transaction.findOne({ user: req.userId })
        const transactionHistoryDoc = await TransactionHistory.findOne({ user: req.userId })
        userTransaction.transactionList.push({
            categoryName: body.categoryName,
            categoryDetail: body.categoryDetail,
            amount: body.amount,
            analysis: body.analysis
        })
        transactionHistoryDoc.transactionHistory.map((trans,i)=>{
            if(trans.date===moment().format('DD/MM/YYYY')){
                pos=i
            }
        })
        if(pos===-1){
            transactionHistoryDoc.transactionHistory.push({
                date: moment().format('DD/MM/YYYY'),
                trasactions: [{
                    categoryName: body.categoryName,
                    categoryDetail: body.categoryDetail,
                    amount: body.amount,
                    analysis: body.analysis
                }]
            })
        }else{
            transactionHistoryDoc.transactionHistory[pos].trasactions.push({
                categoryName: body.categoryName,
                categoryDetail: body.categoryDetail,
                amount: body.amount,
                analysis: body.analysis
            })
        }
        transactionHistoryDoc.save()
        userTransaction.save()
        res.status(200).json({message: 'Transaction Added'})
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Something Went Wrong' })
    }
}

export const editTransaction = async (req, res) => {
    const body = req.body
    let pos=-1
    try {
        const userTransaction = await Transaction.findOne({ user: req.userId })
        userTransaction.transactionList.map((cat,i)=>{
            if(cat._id.toString()===body.id){   
                pos=i
            }
        })
        userTransaction.transactionList.splice(pos, 1, {
            categoryName: body.categoryName,
            categoryDetail: body.categoryDetail,
            amount: body.amount,
            analysis: body.analysis
        })
        userTransaction.save()
        res.status(200).json({message: 'Transaction Edited'})
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Something Went Wrong' })
    }
}

export const deleteTransaction = async (req, res) => {
    const id = req.params.transactionId
    let pos=-1
    try {
        const userTransaction = await Transaction.findOne({ user: req.userId })
        userTransaction.transactionList.map((cat,i)=>{
            if(cat._id.toString()===id.toString()){   
                pos=i
            }
        })
        userTransaction.transactionList.splice(pos, 1)
        userTransaction.save()
        res.status(200).json({message: 'Transaction Deleted'})
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Something Went Wrong' })
    }
}