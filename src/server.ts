import { configDotenv } from 'dotenv'
import express from 'express'
import cors from 'cors'
import { createConnection } from 'mysql'
import { ProjectQuery, TodoQuery } from './models/query.js'

configDotenv({ path: `${process.cwd()}/.env` })
configDotenv({ path: `${process.cwd()}/.env.local` })

export const database = createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
})

try {
    database.connect()
} catch (err: any) {
    throw new Error(err.message)
}

if (!process.env.PROJECT_TABLE || !process.env.TODO_TABLE) {
    throw new Error('Tables are undefined')
}

const projectQuery = new ProjectQuery(process.env.PROJECT_TABLE)
const todoQuery = new TodoQuery(process.env.TODO_TABLE)

const app = express()

app.use(express.json())
app.use(cors())

app.listen(process.env.PORT)

// Project endpoints
app.get('/projects/all', async (_, res) => {
    const projects = await projectQuery.getAll()
    res.end(JSON.stringify(projects))
})

app.get('/projects/active', async (_, res) => {
    const projects = await projectQuery.getActive()
    res.end(JSON.stringify(projects))
})

app.get('/projects/deleted', async (_, res) => {
    const projects = await projectQuery.getDeleted()
    res.end(JSON.stringify(projects))
})

app.post('/projects/add', async (req, res) => {
    const project = await projectQuery.add(req.body)
    res.end(JSON.stringify(project))
})

app.post('/projects/update', async (req, res) => {
    const project = await projectQuery.update(req.body)
    res.end(JSON.stringify(project))
})

app.delete('/projects/delete', async (req, res) => {
    await projectQuery.delete(req.body.id)
    res.end()
})

// Todo endpoints
app.get('/todos/all/:projectId?', async (req, res) => {
    const todos = await todoQuery.getAll(Number(req.params.projectId))
    res.end(JSON.stringify(todos.reverse()))
})

app.get('/todos/active/:projectId?', async (req, res) => {
    const todos = await todoQuery.getActive(Number(req.params.projectId))    
    res.end(JSON.stringify(todos.reverse()))
})

app.get('/todos/deleted/:projectId?', async (req, res) => {
    const todos = await todoQuery.getDeleted(Number(req.params.projectId))
    res.end(JSON.stringify(todos.reverse()))
})

app.post('/todos/add', async (req, res) => {
    const todos = await todoQuery.add(req.body)
    res.end(JSON.stringify(todos))
})

app.post('/todos/update', async (req, res) => {
    const todos = await todoQuery.update(req.body)
    res.end(JSON.stringify(todos))
})

app.delete('/todos/delete', async (req, res) => {
    await todoQuery.delete(req.body.id)
    res.end()
})

// Bin endpoints
// app.get('/bin', async (_, res) => {
//     const activeProjects = await getActiveProjects()
//     const deletedProjects = await getDeletedProjects()
//     const deletedTodos = await getDeletedTodos()

//     const dependentProjects = activeProjects.filter(project => {
//         return deletedTodos.find(todo => {
//             if (todo.projectId === project.id) return project
//         })
//     })

//     dependentProjects.push(...deletedProjects)

//     res.end(
//         JSON.stringify({
//             projects: dependentProjects,
//             todos: deletedTodos,
//         })
//     )
// })
