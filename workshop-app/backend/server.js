const express = require('express')
const Joi = require('joi')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

// middleware
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

// Connecting to DB
mongoose.connect('mongodb://localhost:27018/workshops', { useNewUrlParser: true, useUnifiedTopology: true  })
    .then(() => console.log('Connected to DB...'))
    .catch(err => console.error(`Error: ${err}`))

// Create Workshop Model
const Workshop = mongoose.model('Workshop', new mongoose.Schema({
    name: {
        type: String,
        require: true
    }
}))

// @get routes
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/api/workshops', async (req, res) => {
    const workshop = await Workshop.find().sort({'name': 1}).select({ 'name': 1, '_id': 0 })
    res.send(workshop)
})

app.get('/api/workshops/:id', async (req, res) => {
    const workshop = await Workshop.findById(req.params.id)
    if(!workshop) return res.status(404).send('Requested workshop not found!!')
    res.send(workshop)
})

// @post route
app.post('/api/workshops', async (req, res) => {
    
    const workshop = new Workshop({
        name: req.body.name
    })
    await workshop.save()
    res.send('Successfully stored workshop in DB!')
})

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Listening at port ${port}`))