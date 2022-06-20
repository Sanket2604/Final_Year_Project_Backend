import mongoose from 'mongoose'

const borrowerSchema = mongoose.Schema({
    user: { type: String, required: true },
    borrowerList: [{ type: String, required: true }],
    loans: [
        {
            name: { type: String, required: true },
            startDate: { type: Date, required: true },
            endDate: { type: Date, required: true },
            amount: { type: Number, required: true },
            intrest: { type: Number, required: true },
            paid: { type: Number, required: true },
            status: { type: String, required: true },
            total: { type: Number, required: true },
        }
    ]
}, {
    timestamps: true
})

const Borrower = mongoose.model("Borrower", borrowerSchema)

export default Borrower