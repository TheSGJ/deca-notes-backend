require('dotenv').config()
const connectToMongo = require('./db');
const express = require('express');

connectToMongo();
var cors = require('cors')
const app = express()

const port = 5000

app.use(express.json())
var whitelist = [process.env.CORS_ALLOWED_HOST, process.env.CORS_ALLOWED_HOST_2]
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use('/api/auth', cors(corsOptions), require('./routes/auth'))
app.use('/api/notes', cors(corsOptions), require('./routes/notes'))
app.listen(port, () => {
  console.log(`Deca notes backend app listening on port ${port}`)
})