const exporess = require("express");
const morgan = require('morgan')
const bodyparser = require('body-parser')

const app = exporess();

app.use(morgan('dev'))
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())
app.use(exporess.json())


const categoryRouter = require("./src/routes/categoryRouter");
const transactionRouter = require('./src/routes/transactionRouter')


require("./config/db");

app.use("/api/category", categoryRouter);
app.use('/api/transaction', transactionRouter)

app.listen(3000, () => console.log("server is Running"));
