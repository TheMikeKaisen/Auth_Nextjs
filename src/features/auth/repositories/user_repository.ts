import { db_pool } from "@/lib/db_client";
import { RowDataPacket } from "mysql2/promise";

export interface user_db_row extends RowDataPacket {
  id: string;
  full_name: string;
  email: string;
  password_hash: string;
}

export const user_repository = {
  find_by_email: async (email: string) => {
    const [rows] = await db_pool.execute<user_db_row[]>(
      "SELECT id FROM user_account WHERE email = ?",
      [email]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  create_user: async (id: string, full_name: string, email: string, password_hash: string) => {
    await db_pool.execute(
      "INSERT INTO user_account (id, full_name, email, password_hash) VALUES (?, ?, ?, ?)",
      [id, full_name, email, password_hash]
    );
  },

  find_user_for_login: async (email: string) => {
    const [rows] = await db_pool.execute<user_db_row[]>(
      "SELECT id, full_name, email, password_hash FROM user_account WHERE email = ?",
      [email]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  find_by_id: async (id: string) => {
    const [rows] = await db_pool.execute<user_db_row[]>(
      "SELECT id, full_name, email, password_hash FROM user_account WHERE id = ?",
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  },
  
};