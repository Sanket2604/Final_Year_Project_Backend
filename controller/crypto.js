import Crypto from '../models/crypto.js'

export const getCryptoInvestment = async (req, res) => {
    try {
        const cryptoInvestment = await Crypto.findOne({ user: req.userId })
        if (!cryptoInvestment) {
            let newCryptoInvestment = await Crypto.create({
                user: req.userId,
                investment: []
            })
            res.status(200).json(newCryptoInvestment)
        }
        else {
            let activeInvestment = [], completedInvestment = []
            let investedAmount = 0, totalInvestment = 0, totalReturn = 0
            cryptoInvestment.investments.map(invst => {
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
                cryptoInvestment,
                activeInvestment: {
                    investments: activeInvestment,
                    investedAmount,
                }, 
                completedInvestment: {
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

export const getCryptoSpecificInvestment = async (req, res) => {
    const cryptoId = req.params.cryptoId
    try {
        const cryptoInvestment = await Crypto.findOne({ user: req.userId })
        if (!cryptoInvestment) return res.status(404).json({ message: 'Can not find your Investments' })

        let activeInvestment = [], completedInvestment = []
        let investedAmount = 0, totalInvestment = 0, totalReturn = 0
        let specificInvestments = cryptoInvestment.investments.filter(invst=>{
            return invst.cryptoId===cryptoId
        })
        specificInvestments.map(invst => {
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
            cryptoInvestment, activeInvestment: {
                investments: activeInvestment,
                investedAmount,
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

export const postCryptoInvestment = async (req, res) => {
    try {
        const cryptoInvestment = await Crypto.findOne({ user: req.userId })
        if (!cryptoInvestment) return res.status(404).json({ message: 'Can not find User Details' })
        cryptoInvestment.investments.push(req.body)
        cryptoInvestment.save()
        res.status(200).json({ message: 'Investment Added Successfuly' })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Something Went Wrong' })
    }
}

export const editCryptoInvestment = async (req, res) => {
    const body = req.body
    let pos = 0
    try {
        const cryptoInvestment = await Crypto.findOne({ user: req.userId })
        if (!cryptoInvestment) return res.status(404).json({ message: 'Can not find User Details' })
        cryptoInvestment.investments.map((crypto, i) => {
            if (body.id.toString() === crypto._id.toString()) {
                pos = i
            }
        })
        cryptoInvestment.investments.splice(pos, 1, body)
        cryptoInvestment.save()
        res.status(200).json({ message: 'Investment Edited Successfuly' })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Something Went Wrong' })
    }
}

export const deleteCryptoInvestment = async (req, res) => {
    const invstId = req.params.invstId
    let pos
    try {
        const cryptoInvestment = await Crypto.findOne({ user: req.userId })
        if (!cryptoInvestment) return res.status(404).json({ message: 'Can not find User Details' })
        cryptoInvestment.investments.map((crypto, i) => {
            if (invstId.toString() === crypto._id.toString()) {
                pos = i
            }
        })
        cryptoInvestment.investments.splice(pos, 1)
        cryptoInvestment.save()
        res.status(200).json({ message: 'Investment Deleted Successfuly' })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Something Went Wrong' })
    }
}