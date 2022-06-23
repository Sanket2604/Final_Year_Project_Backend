import express from 'express';
import bodyparser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import account from './routes/account.js'
import loan from './routes/loan.js'
import stock from './routes/stock.js'
import crypto from './routes/crypto.js'
import transaction from './routes/transactions.js'
import category from './routes/category.js'


const app = express();

app.use(bodyparser.json({ limit: "100mb", extended: true }));
app.use(bodyparser.urlencoded({ limit: "100mb", extended: true }));

app.use(cors({
    origin: ['http://localhost:3000', 'https://kaleidoscopic-alpaca-d73288.netlify.app'],
    method: ['GET', 'POST', 'PUT', 'DELETE'],
    optionsSuccessStatus: 200
}));
app.options('*', cors())

const CONNECTION_URL = 'mongodb+srv://Sanket:H6ki22gu0vaZu1pj@cluster0.rpnyq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const PORT = process.env.PORT || 5000;

app.use('/account', account)
app.use('/loan', loan)
app.use('/stock', stock)
app.use('/crypto', crypto)
app.use('/transactions', transaction)
app.use('/category', category)


mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=>{
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    })
    .catch((error)=>{
        console.log(error.message);
    })