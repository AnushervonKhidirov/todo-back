import 'dotenv/config'
import express from 'express'

const app = express()

app.get('/todos', (req, res) => {
    res.end()
})

app.get('/todos/:todoId', (req, res) => {
    res.end()
})

app.post('/todos/add', (req, res) => {
    res.end()
})

app.post('/todos/update/:todoId', (req, res) => {
    res.end()
})

app.post('/todos/delete/:todoId', (req, res) => {
    res.end()
})

app.post('/todos/remove/:todoId', (req, res) => {
    res.end()
})

app.listen(process.env.PORT)
