import { database } from '../server.js'

import type { MysqlError } from 'mysql'
import type { ISqlResult } from '../types/sql.js'
import type { IProject } from '../types/project.js'
import type { ITodo } from '../types/todo.js'

class Query<T extends { id: number }> {
    table: string

    constructor(table: string) {
        this.table = table
    }

    async getById(id: number): Promise<T> {
        try {
            const result = await this.appQuery<T[]>(`SELECT * FROM ${this.table} WHERE id = ${id};`)
            return result[0]
        } catch (err: any) {
            return err.message
        }
    }

    async add(data: T): Promise<T> {
        try {
            const result = await this.appQuery<ISqlResult>(`
                INSERT INTO ${this.table}
                (${this.prepareFields(data, 'key')}) VALUES (${this.prepareFields(data, 'value')});
            `)

            return await this.getById(result.insertId)
        } catch (err: any) {
            return err.message
        }
    }

    async update(data: T): Promise<T> {
        try {
            await this.appQuery<ISqlResult>(
                `UPDATE ${this.table} SET ${this.prepareFields(data)} WHERE id = ${data.id};`
            )
            return await this.getById(data.id)
        } catch (err: any) {
            return err.message
        }
    }

    async delete(id: number) {
        try {
            await this.appQuery<ISqlResult>(`DELETE FROM ${this.table} WHERE id = ${id};`)
        } catch (err: any) {
            return err.message
        }
    }

    async appQuery<T>(query: string): Promise<T> {
        return new Promise((resolve, reject) => {
            database.query(query, (err: MysqlError | null, result: T) => {
                if (err) {
                    reject(err)
                } else resolve(result)
            })
        })
    }

    prepareFields(data: T, get?: 'key' | 'value'): string {
        const arrData: string[] = []

        for (let key in data) {
            if (key === 'id') continue

            if (get === 'key') {
                arrData.push(key)
                continue
            }

            if (get === 'value') {
                arrData.push(`'${data[key]}'`)
                continue
            }

            arrData.push(`${key} = '${data[key]}'`)
        }

        return arrData.join(', ')
    }
}

export class ProjectQuery<T extends IProject> extends Query<T> {
    async getAll(): Promise<T[]> {
        try {
            return await this.appQuery<T[]>(`SELECT * FROM ${this.table};`)
        } catch (err: any) {
            return err.message
        }
    }

    async getActive(): Promise<T[]> {
        try {
            return await this.appQuery<T[]>(`SELECT * FROM ${this.table} WHERE deleted = 0;`)
        } catch (err: any) {
            return err.message
        }
    }

    async getDeleted(): Promise<T[]> {
        try {
            return await this.appQuery<T[]>(`SELECT * FROM ${this.table} WHERE deleted = 1;`)
        } catch (err: any) {
            return err.message
        }
    }
}

export class TodoQuery<T extends ITodo> extends Query<T> {
    async getAll(projectId: number): Promise<T[]> {
        try {
            return await this.appQuery<T[]>(`SELECT * FROM ${this.table} WHERE projectId = ${projectId};`)
        } catch (err: any) {
            return err.message
        }
    }

    async getActive(projectId: number): Promise<T[]> {
        try {
            return await this.appQuery<T[]>(
                `SELECT * FROM ${this.table} WHERE deleted = 0 && projectId = ${projectId};`
            )
        } catch (err: any) {
            return err.message
        }
    }

    async getDeleted(projectId: number): Promise<T[]> {
        try {
            return await this.appQuery<T[]>(
                `SELECT * FROM ${this.table} WHERE deleted = 1 && projectId = ${projectId};`
            )
        } catch (err: any) {
            return err.message
        }
    }
}
