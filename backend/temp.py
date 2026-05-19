
from app import app
from extensions import db
from sqlalchemy import text
with app.app_context():
    res = db.session.execute(text("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'c4_expenditure';")).fetchall()
    print(res)

