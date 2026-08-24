import Database from "@tauri-apps/plugin-sql";

let db = null;

export async function getDb(){
    if(db){ return db; }
    console.log("[DB] loading DB...");
    try {
        db = await Database.load("sqlite:db.sourisfinance.db");
        console.log("[DB] DB loaded, creating tables...");
        await db.execute("CREATE TABLE IF NOT EXISTS expenses (id INTEGER PRIMARY KEY AUTOINCREMENT, amount REAL, description TEXT, date TEXT)");
        await db.execute("CREATE TABLE IF NOT EXISTS incomes (id INTEGER PRIMARY KEY AUTOINCREMENT, amount REAL, source TEXT, date TEXT)");
        await db.execute("CREATE TABLE IF NOT EXISTS archives (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, path TEXT, date TEXT)");
        await db.execute("CREATE TABLE IF NOT EXISTS goals (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, target REAL, date TEXT)");
        console.log("[DB] Tables ready");
    } catch (error) {
        console.error("[DB] Error creating tables: ", error);
        throw error;
    }

    return db;
}