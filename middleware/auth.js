import jwt from 'jsonwebtoken';

export const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];

        let decodedData = jwt.verify(token, 'YourMoneyMatters')

        req.userId = decodedData?.id;

        next();
    } catch (error) {
        res.status(403).json({ message: 'Authentication Failed'})
    }
}
