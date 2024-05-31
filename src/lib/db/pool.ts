import mariadb from 'mariadb'
import { databaseLogger } from '../logger'
import dotenv from "dotenv";

dotenv.config()

const pool = mariadb.createPool({host: process.env.DATABASE_HOST, port: 3306, user: 'user', password: 'password', database: 'Ecobee', connectionLimit: 10 })

databaseLogger("Created Pool.")


export default pool