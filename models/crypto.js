import mongoose from 'mongoose';

const cryptoSchema = mongoose.Schema({
    user: { type: String, required: true },
    investments: [
        {
            logo: { type: String, required: true },
            cryptoId: { type: String, required: true },
            name: { type: String, required: true },
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

const Crypto = mongoose.model("Crypto", cryptoSchema);

export default Crypto;