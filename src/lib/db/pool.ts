import mariadb from 'mariadb'
import { databaseLogger } from '../logger'
const pool = mariadb.createPool({host: process.env.DATABASE_HOST, port: 3306, user: 'user', password: 'password', database: 'Ecobee', connectionLimit: 5 })

databaseLogger("Created Pool.")


export default pool