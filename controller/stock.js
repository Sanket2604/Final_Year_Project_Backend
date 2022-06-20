import Stock from '../models/stock.js'

export const getStockInvestment = async (req, res) => {
    try {
        const stockInvestment = await Stock.findOne({ user: req.userId })
        if (!stockInvestment) {
            let newStockInvestment = await Stock.create({
                user: req.userId,
                investment: []
            })
            res.status(200).json(newStockInvestment)
        }
        else {
            let activeInvestment = [], completedInvestment = []
            let investedAmount = 0, totalInvestment = 0, totalReturn = 0
            stockInvestment.investments.map(invst => {
                if (invst.status === 'active') {
                    activeInvestment.push(invst)
                    investedAmount += invst.investment
                }
                else {
                    completedInvestment.push(invst)
                    totalInvestment += invst.investment
                    totalReturn += (invst.closedAt * invst.quantity)
                }
            })
            res.status(200).json({
                stockInvestment, activeInvestment: {
                    investments: activeInvestment,
                    investedAmount,
                }, completedInvestment: {
                    investments: completedInvestment,
                    totalInvestment,
                    totalReturn: totalReturn.toFixed(2)
                }
            })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Something Went Wrong' })
    }
}

export const getStockSpecificInvestment = async (req, res) => {
    const stockId = req.params.stockId
    try {
        const stockInvestment = await Stock.findOne({ user: req.userId })
        if (!stockInvestment) return res.status(404).json({ message: 'Can not find your Investments' })

        let activeInvestment = [], completedInvestment = []
        let investedAmount = 0, totalInvestment = 0, totalReturn = 0, totalQuantity = 0
        let specificInvestments = stockInvestment.investments.filter(invst=>{
            return invst.symbol===stockId
        })
        specificInvestments.map(invst => {
            if (invst.status === 'active') {
                activeInvestment.push(invst)
                investedAmount += invst.investment
                totalQuantity += invst.quantity
            }
            else {
                completedInvestment.push(invst)
                totalInvestment += invst.investment
                totalReturn += (invst.closedAt * invst.quantity)
            }
        })
        res.status(200).json({
            stockInvestment, activeInvestment: {
                investments: activeInvestment,
                investedAmount,
                totalQuantity
            }, completedInvestment: {
                investments: completedInvestment,
                totalInvestment,
                totalReturn: totalReturn.toFixed(2)
            }
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Something Went Wrong' })
    }
}

export const postStockInvestment = async (req, res) => {
    try {
        const stockInvestment = await Stock.findOne({ user: req.userId })
        if (!stockInvestment) return res.status(404).json({ message: 'Can not find User Details' })
        stockInvestment.investments.push(req.body)
        stockInvestment.save()
        res.status(200).json({ message: 'Investment Added Successfuly' })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Something Went Wrong' })
    }
}

export const editStockInvestment = async (req, res) => {
    const body = req.body
    let pos = 0
    try {
        const stockInvestment = await Stock.findOne({ user: req.userId })
        if (!stockInvestment) return res.status(404).json({ message: 'Can not find User Details' })
        stockInvestment.investments.map((stock, i) => {
            if (body.id.toString() === stock._id.toString()) {
                pos = i
            }
        })
        stockInvestment.investments.splice(pos, 1, body)
        stockInvestment.save()
        res.status(200).json({ message: 'Investment Edited Successfuly' })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Something Went Wrong' })
    }
}

export const deleteStockInvestment = async (req, res) => {
    const invstId = req.params.invstId
    let pos
    try {
        const stockInvestment = await Stock.findOne({ user: req.userId })
        if (!stockInvestment) return res.status(404).json({ message: 'Can not find User Details' })
        stockInvestment.investments.map((stock, i) => {
            if (invstId.toString() === stock._id.toString()) {
                pos = i
            }
        })
        stockInvestment.investments.splice(pos, 1)
        stockInvestment.save()
        res.status(200).json({ message: 'Investment Deleted Successfuly' })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Something Went Wrong' })
    }
}