import sys
import os
from datetime import date

# Add the current directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app
from extensions import db
from models.models import C21Students, C22ReservedCategorySeats, C212Reservation
from routes.api_routes import to_dict

def test_c21_and_c22():
    with app.app_context():
        # Clean up any existing test records if they exist
        db.session.query(C21Students).delete()
        db.session.query(C22ReservedCategorySeats).delete()
        db.session.query(C212Reservation).delete()
        db.session.commit()

        print("Testing C21Students...")
        student_rec = C21Students(
            enrollment_year="2023-24",
            student_name="Aman Sharma",
            enrollment_number="EN12345",
            enrollment_date=date(2023, 8, 15)
        )
        db.session.add(student_rec)
        db.session.commit()

        # Query and test serialization
        queried_student = C21Students.query.first()
        assert queried_student is not None
        serialized_student = to_dict(queried_student)
        print("Serialized Student:", serialized_student)
        assert serialized_student["enrollment_year"] == "2023-24"
        assert serialized_student["student_name"] == "Aman Sharma"
        assert serialized_student["enrollment_number"] == "EN12345"
        assert serialized_student["enrollment_date"] == "2023-08-15"

        print("Testing C22ReservedCategorySeats...")
        reserved_rec = C22ReservedCategorySeats(
            year="2023-24",
            category="SC",
            reserved_seats=15,
            document_link="http://example.com/doc"
        )
        db.session.add(reserved_rec)
        db.session.commit()

        queried_reserved = C22ReservedCategorySeats.query.first()
        assert queried_reserved is not None
        serialized_reserved = to_dict(queried_reserved)
        print("Serialized Reserved:", serialized_reserved)
        assert serialized_reserved["year"] == "2023-24"
        assert serialized_reserved["category"] == "SC"
        assert serialized_reserved["reserved_seats"] == 15
        assert serialized_reserved["document_link"] == "http://example.com/doc"

        print("Testing C212Reservation column mapping & serialization...")
        res_rec = C212Reservation(
            year="2023-24",
            earmarked_sc=10,
            earmarked_st=5,
            admitted_sc=8,
            admitted_st=4
        )
        db.session.add(res_rec)
        db.session.commit()

        queried_res = C212Reservation.query.first()
        assert queried_res is not None
        serialized_res = to_dict(queried_res)
        print("Serialized C212Reservation:", serialized_res)
        assert serialized_res["ear_sc"] == 10
        assert serialized_res["ear_st"] == 5
        assert serialized_res["adm_sc"] == 8
        assert serialized_res["adm_st"] == 4

        # Clean up test data
        db.session.delete(queried_student)
        db.session.delete(queried_reserved)
        db.session.delete(queried_res)
        db.session.commit()
        print("All local tests passed successfully!")

if __name__ == "__main__":
    test_c21_and_c22()
