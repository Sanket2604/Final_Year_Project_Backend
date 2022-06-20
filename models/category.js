import mongoose from 'mongoose'

const categorySchema = mongoose.Schema({
    user: { type: String, required: true },
    categoryList: [
        {
            name: { type: String, required: true },
            total: { type: Number, required: true },
            type: { type: String, required: true },
        }
    ]
}, {
    timestamps: true
})

const Category = mongoose.model("Category", categorySchema)

export default Category