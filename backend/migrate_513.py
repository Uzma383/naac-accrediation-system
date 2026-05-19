from app import app
from extensions import db
from sqlalchemy import text

with app.app_context():
    try:
        db.session.execute(text("ALTER TABLE c513_skill_initiatives ADD COLUMN year VARCHAR(20)"))
        db.session.commit()
        print("Added year column")
    except Exception as e:
        db.session.rollback()
        print(f"Error adding year: {e}")
        
    try:
        db.session.execute(text("ALTER TABLE c513_skill_initiatives ADD COLUMN proof_links TEXT"))
        db.session.commit()
        print("Added proof_links column")
    except Exception as e:
        db.session.rollback()
        print(f"Error adding proof_links: {e}")
