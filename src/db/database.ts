import Database from "@tauri-apps/plugin-sql";

export async function initDatabase() {
  const db = await Database.load("sqlite:souris_finance.db");
  return db;
}