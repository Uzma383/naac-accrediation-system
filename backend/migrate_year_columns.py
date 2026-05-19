from app import app
from extensions import db
from sqlalchemy import text

tables = [
    "c514_competitive_exams",
    "c521_placements",
    "c523_qualifying_exams",
    "c531_sports_awards",
    "c632_teacher_financial",
    "c642_non_gov_grants",
    "c653_quality_initiatives"
]

with app.app_context():
    for table in tables:
        try:
            # Alter column type to VARCHAR(20) and drop NOT NULL constraint
            query = f"ALTER TABLE {table} ALTER COLUMN year TYPE VARCHAR(20) USING year::varchar, ALTER COLUMN year DROP NOT NULL"
            db.session.execute(text(query))
            db.session.commit()
            print(f"Successfully migrated table: {table}")
        except Exception as e:
            db.session.rollback()
            print(f"Error migrating table {table}: {e}")
