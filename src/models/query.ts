import { database } from '../server.js'

import type { MysqlError } from 'mysql'
import type { ISqlAddResult } from '../types/sql.js'

class Query<T extends { id: number }> {
    table: string

    constructor(table: string) {
        this.table = table
    }

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
            const result = await this.appQuery<ISqlAddResult>(`INSERT INTO ${this.table} (${this.prepareFields(data, 'key')}) VALUES (${this.prepareFields(data, 'value')});`)
            
            return await this.getById(result.insertId)
        } catch (err: any) {
            return err.message
        }
    }

    async update(data: T): Promise<T> {
        try {
            await this.appQuery<ISqlAddResult>(
                `UPDATE ${this.table} SET ${this.prepareFields(data)} WHERE id = ${data.id} `
            )
            return await this.getById(data.id)
        } catch (err: any) {
            return err.message
        }
    }

    async delete(id: number) {
        try {
            await this.appQuery<ISqlAddResult>(`DELETE FROM ${this.table} WHERE id = ${id}`)
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
            if (key === 'id' || key === 'projectId') continue

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

export default Query
