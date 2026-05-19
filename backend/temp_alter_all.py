from app import app
from extensions import db
from sqlalchemy import text

with app.app_context():
    sql = """
    SELECT table_name, column_name 
    FROM information_schema.columns 
    WHERE data_type = 'integer' 
      AND (column_name LIKE '%year%' OR column_name LIKE '%date%')
      AND table_schema = 'public'
    """
    res = db.session.execute(text(sql)).fetchall()
    
    for row in res:
        table, col = row[0], row[1]
        print(f'Altering {table}.{col}')
        try:
            db.session.execute(text(f'ALTER TABLE {table} ALTER COLUMN {col} TYPE VARCHAR(50);'))
            db.session.commit()
            print('  -> Success!')
        except Exception as e:
            db.session.rollback()
            print('  -> Failed:', e)
