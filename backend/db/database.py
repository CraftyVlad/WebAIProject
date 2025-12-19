import sqlite3 

def get_db():
    return sqlite3.connect(
        "store.db",
        timeout=10,
        check_same_thread=False
    )