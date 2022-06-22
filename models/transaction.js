import mongoose from 'mongoose'

const transactionSchema = mongoose.Schema({
    user: { type: String, required: true },
    transactionList: [{
        categoryName: { type: String, required: true },
        categoryDetail: { type: String, required: true },
        amount: { type: Number, required: true },
        analysis: { type: String, required: true },
    }]
}, {
    timestamps: true
})

const Transaction = mongoose.model("Transaction", transactionSchema)

export default Transaction