const connectToMongo = require('./db');
const express = require('express');

connectToMongo();

const app = express()
const port = 3000

app.use(express.json())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))
app.listen(port, () => {
  console.log(`Deca notes backend app listening on port ${port}`)
})