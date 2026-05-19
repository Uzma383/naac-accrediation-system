
from app import app
from extensions import db
from sqlalchemy import text
with app.app_context():
    queries = [
        'ALTER TABLE c4_expenditure ALTER COLUMN year TYPE VARCHAR(50);',
        'ALTER TABLE c313_events ALTER COLUMN year TYPE VARCHAR(50);',
        'ALTER TABLE c321_papers ALTER COLUMN year_of_publication TYPE VARCHAR(50);',
        'ALTER TABLE c322_books ALTER COLUMN year_of_publication TYPE VARCHAR(50);',
        'ALTER TABLE c332_extension_awards ALTER COLUMN award_year TYPE VARCHAR(50);',
        'ALTER TABLE c333_outreach ALTER COLUMN year TYPE VARCHAR(50);',
        'ALTER TABLE c341_collaborations ALTER COLUMN year TYPE VARCHAR(50);',
        'ALTER TABLE c342_mous ALTER COLUMN signing_year TYPE VARCHAR(50);',
        'ALTER TABLE c3_research_projects ALTER COLUMN year_of_award TYPE VARCHAR(50);'
    ]
    for q in queries:
        try:
            db.session.execute(text(q))
            db.session.commit()
            print('Successfully executed:', q)
        except Exception as e:
            db.session.rollback()
            print('Failed:', q, e)

