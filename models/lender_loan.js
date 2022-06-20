import mongoose from 'mongoose';

const lenderSchema = mongoose.Schema({
    user: { type: String, required: true },
    lenderList: [{ type: String, required: true }],
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

const Lender = mongoose.model("Lender", lenderSchema);

export default Lender;