import mongoose from 'mongoose'

const transactionHistorySchema = mongoose.Schema({
    user: { type: String, required: true },
    transactionHistory: [{
        date: { type: String, required: true },
        trasactions:[{
            categoryName: { type: String, required: true },
            categoryDetail: { type: String, required: true },
            amount: { type: Number, required: true },
            analysis: { type: String, required: true },
        }]
    }]
}, {
    timestamps: true
})

const TransactionHistory = mongoose.model("TransactionHistory", transactionHistorySchema)

export default TransactionHistory