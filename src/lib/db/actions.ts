import pool from "./pool";

import { databaseLogger } from "../logger";

export const insert = async (statement: string) => {
  let conn;

  try {
    databaseLogger("attempting connection");
    conn = await pool.getConnection();
    const res = await conn.query(statement);

    databaseLogger(
      `(${statement}) Inserted ${String(res.affectedRows)} record(s).`
    );

    return res;
  } catch (e) {
    databaseLogger(String(e));
  } finally {
    if (conn) conn.end();
  }
};

export const select = async (statement: string) => {
  let conn;

  try {
    databaseLogger("attempting connection");
    conn = await pool.getConnection();
    const res = await conn.query(statement);

    databaseLogger(`(${statement}) Found ${String(res.length)} record(s).`);

    return res;
  } catch (e) {
    databaseLogger(String(e));
  } finally {
    if (conn) conn.end();
  }
};
