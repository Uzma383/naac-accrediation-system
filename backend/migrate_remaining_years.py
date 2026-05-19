from app import app
from extensions import db
from sqlalchemy import text

tables = [
    "c113_teacher_bodies",
    "c212_reservation",
    "c263_pass_percentage",
    "c313_events",
    "c333_outreach",
    "c341_collaborations",
    "c3_sanctioned_posts",
    "c4_expenditure"
]

with app.app_context():
    for table in tables:
        try:
            # Alter column type to VARCHAR(20) and drop NOT NULL constraint if needed
            query = f"ALTER TABLE {table} ALTER COLUMN year TYPE VARCHAR(20) USING year::varchar, ALTER COLUMN year DROP NOT NULL"
            db.session.execute(text(query))
            db.session.commit()
            print(f"Successfully migrated table: {table}")
        except Exception as e:
            db.session.rollback()
            print(f"Error migrating table {table}: {e}")
