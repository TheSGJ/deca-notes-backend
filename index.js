const connectToMongo = require('./db');
const express = require('express');

connectToMongo();
var cors = require('cors')
const app = express()
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
});
const port = 5000

app.use(express.json())
app.use(cors())
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))
app.listen(port, () => {
  console.log(`Deca notes backend app listening on port ${port}`)
})