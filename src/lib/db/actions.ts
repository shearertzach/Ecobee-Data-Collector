import pool from "./pool";

import { databaseLogger } from "../logger";
import { isDBLoggerEnabled } from "../util/globals";

export const insert = async (statement: string) => {
  let conn;

  try {
    conn = await pool.getConnection();
    const res = await conn.query(statement);

    isDBLoggerEnabled &&
      databaseLogger(
        `(${statement}) Inserted ${String(res.affectedRows)} record(s).`
      );

    return res;
  } finally {
    if (conn) conn.release();
  }
};

export const select = async (statement: string) => {
  let conn;

  try {
    conn = await pool.getConnection();
    const res = await conn.query(statement);

    isDBLoggerEnabled &&
      databaseLogger(`(${statement}) Found ${String(res.length)} record(s).`);

    return res;
  } finally {
    if (conn) conn.release();
  }
};
