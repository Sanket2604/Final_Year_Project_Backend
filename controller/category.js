import Category from '../models/category.js'


export const getCategoryList = async (req, res) => {

    try {
        const userCategory = await Category.findOne({ user: req.userId })
        let categoryList=[]
        userCategory?.categoryList?.map(cat=>{
            categoryList.push(cat.name)
        })
        res.status(200).json(categoryList)
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Something Went Wrong' })
    }
}

export const addNewCategory = async (req, res) => {
    const body = req.body
    try {
        const userCategory = await Category.findOne({ user: req.userId })
        userCategory.categoryList.push({
            name: body.name,
            total: body.total,
            type: body.type
        })
        userCategory.save()
        res.status(200).json({message: 'Category Added'})
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Something Went Wrong' })
    }
}

export const editCategory = async (req, res) => {
    const body = req.body
    let pos=-1
    try {
        const userCategory = await Category.findOne({ user: req.userId })
        userCategory.categoryList.map((cat,i)=>{
            if(cat._id.toString()===body.id){   
                pos=i
            }
        })
        userCategory.categoryList.splice(pos, 1, {
            name: body.name,
            total: body.total,
            type: body.type
        })
        userCategory.save()
        res.status(200).json({message: 'Category Edited'})
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Something Went Wrong' })
    }
}

export const deleteCategory = async (req, res) => {
    const id = req.params.catId
    let pos=-1
    try {
        const userCategory = await Category.findOne({ user: req.userId })
        userCategory.categoryList.map((cat,i)=>{
            if(cat._id.toString()===id.toString()){   
                pos=i
            }
        })
        userCategory.categoryList.splice(pos, 1)
        userCategory.save()
        res.status(200).json({message: 'Category Deleted'})
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Something Went Wrong' })
    }
}
