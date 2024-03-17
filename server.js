const injectRoutes = require('./routes/index.js')

const express = require('express')

const app = express()
app.use(express.json());

app.use('/api', injectRoutes())


const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

module.exports = server
