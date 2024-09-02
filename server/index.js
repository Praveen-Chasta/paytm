const express = require("express");
const cors = require("cors");
const rootrouter = require("./routes/index")
const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/paytm';

const app = express();
const PORT = 8000;


app.use(cors());
app.use(express.json());
app.use("/", rootrouter)

mongoose.connect(url, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // replicaSet: 'rs0'  
  })
    .then(() => {
        console.log('Connected successfully to MongoDB with Mongoose');

    })
    .catch(error => {
        console.error('Error connecting to MongoDB with Mongoose:', error);
    });


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ msg: 'Something went wrong!' });
});
    
app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`)
})