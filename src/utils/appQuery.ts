import { database } from '../server.js'
import type { MysqlError } from 'mysql'

export async function appQuery<T>(query: string): Promise<T> {
    return new Promise((resolve, reject) => {
        database.query(query, (err: MysqlError | null, result: T) => {
            if (err) {
                reject(err)
            } else resolve(result)
        })
    })
}
