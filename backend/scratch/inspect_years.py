import sys
import os

# Add the parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app
from extensions import db
import models.models as m

with app.app_context():
    print("Inspecting models in models.py:")
    for name in dir(m):
        cls = getattr(m, name)
        if isinstance(cls, type) and issubclass(cls, db.Model) and cls is not db.Model:
            # check if class has a year/academic_year column of type Integer
            table = cls.__table__
            for col in table.columns:
                if col.name in ['year', 'academic_year'] and str(col.type).lower().startswith('integer'):
                    print(f"Table '{table.name}' (Model: {name}) has column '{col.name}' of type INTEGER.")
