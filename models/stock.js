import mongoose from 'mongoose';

const stockSchema = mongoose.Schema({
    user: { type: String, required: true },
    investments: [
        {
            name: { type: String, required: true },
            symbol: { type: String, required: true },
            startDate: { type: Date, required: true },
            endDate: { type: Date },
            boughtAt: { type: Number, required: true },
            closedAt: { type: Number, required: true },
            quantity: { type: Number, required: true },
            investment: { type: Number, required: true },
            status: { type: String, required: true }
        }
    ]
}, {
    timestamps: true
})

const Stock = mongoose.model("Stock", stockSchema);

export default Stock;