import 'dotenv/config'
import fsSimple from 'fs'
import fs from 'fs/promises'
import { v4 as uuid } from 'uuid'

export async function addProject(name) {
    const project = {
        id: uuid(),
        name: name,
        todos: [],
        isOnTrash: false,
    }

    const allProjects = await getProjects()
    allProjects.push(project)
    updateProjects(allProjects)
    return project
}

export async function updateProject(projectData) {
    const data = await getProjects()
    const newData = data.map(project => (project.id === projectData.id ? projectData : project))
    updateProjects(newData)
    return projectData    
}

export async function removeProject(id) {
    const data = await getProjects()
    const newData = data.filter(project => project.id !== id)
    updateProjects(newData)
    return {}
}

export async function getProjects(filter) {
    await createProjectJson()
    const allProject = (
        await fs.readFile(`${process.cwd()}/${process.env.DB_FOLDER}/${process.env.PROJECT_FILE}`)
    ).toString()

    const allProjectObject = allProject === '' ? [] : JSON.parse(allProject)

    if (filter === 'active' && allProjectObject.length !== 0) return allProjectObject.filter(project => !project.isOnTrash)
    if (filter === 'removed' && allProjectObject.length !== 0) return allProjectObject.filter(project => project.isOnTrash)
    return allProjectObject
}

export async function getProjectById(id) {
    
}

async function updateProjects(projects) {
    fs.writeFile(`${process.cwd()}/${process.env.DB_FOLDER}/${process.env.PROJECT_FILE}`, JSON.stringify(projects))
}

async function createProjectJson() {
    if (!fsSimple.existsSync(`${process.cwd()}/${process.env.DB_FOLDER}`))
        fsSimple.mkdirSync(`${process.cwd()}/${process.env.DB_FOLDER}`)
    if (!fsSimple.existsSync(`${process.cwd()}/${process.env.DB_FOLDER}/${process.env.PROJECT_FILE}`))
        fsSimple.writeFileSync(`${process.cwd()}/${process.env.DB_FOLDER}/${process.env.PROJECT_FILE}`, '[]')
}
