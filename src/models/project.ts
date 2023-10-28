import { configDotenv } from 'dotenv'

import { appQuery } from '../utils/appQuery.js'
import { prepareFields } from '../utils/prepareFields.js'

import type { IProject } from '../types/project.js'
import type { ISqlAddResult } from '../types/sql.js'

configDotenv({ path: `${process.cwd()}/.env` })
const PROJECT_TABLE = process.env.PROJECT_TABLE

export async function addProject(name: string): Promise<IProject> {
    try {
        const result = await appQuery<ISqlAddResult>(`INSERT INTO ${PROJECT_TABLE} (name) VALUES ('${name}');`)
        return await getProjectById(result.insertId)
    } catch (err: any) {
        return err.message
    }
}

export async function updateProject(project: IProject): Promise<IProject> {
    try {
        await appQuery<ISqlAddResult>(`UPDATE ${PROJECT_TABLE} SET ${prepareFields<IProject>(project)} WHERE id = ${project.id} `)
        return await getProjectById(project.id)
    } catch (err: any) {
        return err.message
    }
}

export async function deleteProject(id: number) {
    try {
        await appQuery<ISqlAddResult>(`DELETE FROM ${PROJECT_TABLE} WHERE id = ${id}`)
    } catch (err: any) {
        return err.message
    }
}

export async function getAllProjects(): Promise<IProject[]> {
    try {
        return await appQuery<IProject[]>(`SELECT * FROM ${PROJECT_TABLE};`)
    } catch (err: any) {
        return err.message
    }
}

export async function getActiveProjects(): Promise<IProject[]> {
    try {
        return await appQuery<IProject[]>(`SELECT * FROM ${PROJECT_TABLE} WHERE deleted = 0;`)
    } catch (err: any) {
        return err.message
    }
}

export async function getDeletedProjects(): Promise<IProject[]> {
    try {
        return await appQuery<IProject[]>(`SELECT * FROM ${PROJECT_TABLE} WHERE deleted = 1;`)
    } catch (err: any) {
        return err.message
    }
}

export async function getProjectById(id: number): Promise<IProject> {
    try {
        const result = await appQuery<IProject[]>(`SELECT * FROM ${PROJECT_TABLE} WHERE id = ${id};`)
        return result[0]
    } catch (err: any) {
        return err.message
    }
}
