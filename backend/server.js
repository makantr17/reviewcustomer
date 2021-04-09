import express from 'express'

import dotenv from 'dotenv'
import config from './config'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cors from 'cors'

import productRouter from './routers/productRouter'
import reviewRouter from './routers/reviewRouter'
import userRouter from './routers/userRouter'
import collectionRouter from './routers/dataRouter'

const port = process.env.PORT || 7000
// config mongoose db
dotenv.config();
const mongodbUrl = config.MONGODB_URL;
mongoose.connect(mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).catch(error => console.log(error.raison));
// create app



const app = express();
app.use(bodyParser.json());

// midle ware
app.use(cors());
app.use("/api/products", productRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/users", userRouter);
app.use("/api/collections", collectionRouter);

// app.use(express.static(path.resolve(__dirname, 'frontend/')));

app.listen(port, ()=>{ console.log("Server started at htttp://localhost:7000")});
