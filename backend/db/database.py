import sqlite3

DB_NAME = "store.db"

def get_db():
    return sqlite3.connect(DB_NAME)