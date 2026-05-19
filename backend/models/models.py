from extensions import db
from datetime import datetime, date


# ==============================================================================
# AUDIT MIXIN
# ==============================================================================

class AuditMixin:
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_by_id = db.Column(db.Integer, db.ForeignKey('users.id', name='fk_created_by'), nullable=True)
    updated_by_id = db.Column(db.Integer, db.ForeignKey('users.id', name='fk_updated_by'), nullable=True)

# ==============================================================================
# AUTH & UTILITY MODELS
# ==============================================================================

class User(db.Model, AuditMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), default='Admin')
    department = db.Column(db.String(255), nullable=True)
    user_identifier = db.Column(db.String(100), unique=True, nullable=True)
    year = db.Column(db.String(50), nullable=True)

    def __repr__(self):
        return f"<User {self.username}>"


# ==============================================================================
# LOOKUP & METADATA MODELS (Used for dropdowns and dynamic forms)
# ==============================================================================

class SemesterLookup(db.Model):
    __tablename__ = 'semester_lookup'
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.String(100), unique=True, nullable=False)

class SemesterCourseLookup(db.Model):
    __tablename__ = 'semester_course_lookup'
    id = db.Column(db.Integer, primary_key=True)
    semester = db.Column(db.String(100), nullable=False)
    course_code = db.Column(db.String(100), nullable=False)
    course_name = db.Column(db.String(255), nullable=False)

class CourseTypeLookup(db.Model):
    __tablename__ = 'course_type_lookup'
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.String(100), unique=True, nullable=False)

class AcademicYearLookup(db.Model):
    __tablename__ = 'academic_year_lookup'
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.String(100), unique=True, nullable=False)

class ReservedCategoryLookup(db.Model):
    __tablename__ = 'reserved_category_lookup'
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.String(100), unique=True, nullable=False)

class LibraryResourceLookup(db.Model):
    __tablename__ = 'library_resource_lookup'
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.String(100), unique=True, nullable=False)

class QualifyingExamLookup(db.Model):
    __tablename__ = 'qualifying_exam_lookup'
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.String(100), unique=True, nullable=False)

class EventLevelLookup(db.Model):
    __tablename__ = 'event_level_lookup'
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.String(100), unique=True, nullable=False)

class AwardCategoryLookup(db.Model):
    __tablename__ = 'award_category_lookup'
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.String(100), unique=True, nullable=False)

class DepartmentLookup(db.Model):
    __tablename__ = 'department_lookup'
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.String(255), unique=True, nullable=False)

class DesignationLookup(db.Model):
    __tablename__ = 'designation_lookup'
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.String(100), unique=True, nullable=False)

class HighestDegreeLookup(db.Model):
    __tablename__ = 'highest_degree_lookup'
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.String(100), unique=True, nullable=False)

class AppointmentTypeLookup(db.Model):
    __tablename__ = 'appointment_type_lookup'
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.String(100), unique=True, nullable=False)

class FundingAgencyLookup(db.Model):
    __tablename__ = 'funding_agency_lookup'
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.String(255), unique=True, nullable=False)

class LevelLookup(db.Model):
    __tablename__ = 'level_lookup'
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.String(100), unique=True, nullable=False)

class TeamIndividualLookup(db.Model):
    __tablename__ = 'team_individual_lookup'
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.String(50), unique=True, nullable=False)

class StudentLookup(db.Model):
    __tablename__ = 'student_filter_lookup'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    course_code = db.Column(db.String(100), nullable=False)

class EGovernanceAreaLookup(db.Model):
    __tablename__ = 'egovernance_area_lookup'
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.String(100), unique=True, nullable=False)

class Evidence(db.Model, AuditMixin):
    __tablename__ = 'evidence'
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.Text, nullable=False)
    criterion_type = db.Column(db.String(50), nullable=True)
    record_id = db.Column(db.Integer, nullable=True)

# Legacy / Route specific utilities
class AcademicYear(db.Model):
    __tablename__ = 'academic_years'
    id = db.Column(db.Integer, primary_key=True)
    year_name = db.Column(db.String(20), unique=True, nullable=False)

class AddonSubject(db.Model):
    __tablename__ = 'addon_subjects'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    year_level = db.Column(db.String(50), nullable=True)

class ProofLink11(db.Model):
    __tablename__ = 'proof_link_11'
    id = db.Column(db.Integer, primary_key=True)
    link = db.Column(db.Text, nullable=True)

class ProofLink121(db.Model):
    __tablename__ = 'proof_link_121'
    id = db.Column(db.Integer, primary_key=True)
    link = db.Column(db.Text, nullable=True)

class ProofLink122_123(db.Model):
    __tablename__ = 'proof_link_122_123'
    id = db.Column(db.Integer, primary_key=True)
    link = db.Column(db.Text, nullable=True)


# ==============================================================================
# CORE DIMENSION MODELS (User-Provided)
# ==============================================================================

class Program(db.Model, AuditMixin):
    __tablename__ = 'program_lookup'

    id = db.Column(db.Integer, primary_key=True)
    program_code = db.Column(db.String(50), nullable=False, unique=True)
    program_name = db.Column(db.String(255), nullable=False)
    department = db.Column(db.String(255), nullable=True)
    year_of_introduction = db.Column(db.String(50), nullable=True)

    # Relationships (Using unique backrefs to avoid conflicts)
    courses = db.relationship('Course', backref='program_rel', lazy=True)
    cbcs_entries = db.relationship('C121CBCS', backref='program_rel', lazy=True)
    addons = db.relationship('C122Addon', backref='program_rel', lazy=True)
    experiential = db.relationship('C132Experiential', backref='program_rel', lazy=True)
    projects = db.relationship('C133Projects', backref='program_rel', lazy=True)
    enrolments = db.relationship('C211Enrolment', backref='program_rel', lazy=True)
    pass_percentages = db.relationship('C263PassPercentage', backref='program_rel', lazy=True)

    def __repr__(self):
        return f"<Program {self.program_code} - {self.program_name}>"


class Course(db.Model, AuditMixin):
    __tablename__ = 'course_lookup'

    id = db.Column(db.Integer, primary_key=True)
    course_code = db.Column(db.String(50), nullable=False, unique=True)
    course_name = db.Column(db.String(255), nullable=False)
    year_of_introduction = db.Column(db.String(50), nullable=True)
    program_id = db.Column(db.Integer, db.ForeignKey('program_lookup.id'), nullable=True)

    def __repr__(self):
        return f"<Course {self.course_code} - {self.course_name}>"


class Student(db.Model, AuditMixin):
    __tablename__ = 'student_lookup'

    id = db.Column(db.Integer, primary_key=True)
    enrollment_number = db.Column(db.String(100), nullable=False, unique=True)
    name = db.Column(db.String(255), nullable=False)
    program_id = db.Column(db.Integer, db.ForeignKey('program_lookup.id'), nullable=True)
    category = db.Column(db.String(50), nullable=True)

    program = db.relationship('Program', backref='students_rel')

    def __repr__(self):
        return f"<Student {self.enrollment_number} - {self.name}>"


class Teacher(db.Model, AuditMixin):
    __tablename__ = 'teacher_lookup'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    pan = db.Column(db.String(20), nullable=True, unique=True)
    aadhar_or_id = db.Column(db.String(20), nullable=True)
    email = db.Column(db.String(255), nullable=True)
    gender = db.Column(db.String(10), nullable=True)
    designation = db.Column(db.String(100), nullable=True)
    department = db.Column(db.String(255), nullable=True)
    joining_date = db.Column(db.Date, nullable=True)
    leaving_date = db.Column(db.Date, nullable=True)
    highest_degree = db.Column(db.String(100), nullable=True)
    degree_year = db.Column(db.String(50), nullable=True)
    is_still_serving = db.Column(db.Boolean, nullable=True, default=True)

    def __repr__(self):
        return f"<Teacher {self.name} - {self.designation}>"


# ==============================================================================
# CRITERIA 1 MODELS
# ==============================================================================

class C11Courses(db.Model, AuditMixin):
    """Criteria 1.1 - Number of courses offered across all programs during the year"""
    __tablename__ = 'c11_courses'

    id = db.Column(db.Integer, primary_key=True)
    academic_year = db.Column(db.String(20), nullable=False)
    program_id = db.Column(db.Integer, db.ForeignKey('program_lookup.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('course_lookup.id'), nullable=False)
    proof_links = db.Column(db.Text, nullable=True)

    program = db.relationship('Program', backref='c11_rel')
    course = db.relationship('Course', backref='c11_rel')

class C113TeacherBodies(db.Model, AuditMixin):
    """Criteria 1.1.3 - Teachers participating in curriculum development activities"""
    __tablename__ = 'c113_teacher_bodies'

    id = db.Column(db.Integer, primary_key=True)
    year = db.Column(db.String(50), nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teacher_lookup.id'), nullable=False)
    body_name = db.Column(db.String(255), nullable=False)
    proof_document = db.Column(db.Text, nullable=True)

    teacher = db.relationship('Teacher', backref='c113_rel')

class C121CBCS(db.Model, AuditMixin):
    """Criteria 1.2.1 - Programmes with CBCS / elective course system"""
    __tablename__ = 'c121_cbcs'

    id = db.Column(db.Integer, primary_key=True)
    program_id = db.Column(db.Integer, db.ForeignKey('program_lookup.id'), nullable=False)
    status_of_implementation = db.Column(db.Boolean, nullable=True)
    year_of_implementation = db.Column(db.String(50), nullable=True)
    proof_links = db.Column(db.Text, nullable=True)

class C122Addon(db.Model, AuditMixin):
    """Criteria 1.2.2 & 1.2.3 - Add on / Certificate programs offered"""
    __tablename__ = 'c122_addon'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('course_lookup.id'), nullable=True)
    program_id = db.Column(db.Integer, db.ForeignKey('program_lookup.id'), nullable=True)
    year_of_offering = db.Column(db.String(50), nullable=True)
    times_offered = db.Column(db.Integer, nullable=True)
    duration = db.Column(db.String(100), nullable=True)
    students_enrolled = db.Column(db.Integer, nullable=True)
    students_completed = db.Column(db.Integer, nullable=True)

    course = db.relationship('Course', backref='addon_rel')

class C132Experiential(db.Model, AuditMixin):
    """Criteria 1.3.2 - Courses with experiential learning"""
    __tablename__ = 'c132_experiential'

    id = db.Column(db.Integer, primary_key=True)
    program_id = db.Column(db.Integer, db.ForeignKey('program_lookup.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('course_lookup.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('student_lookup.id'), nullable=True)
    year_of_offering = db.Column(db.String(50), nullable=True)
    proof_links = db.Column(db.Text, nullable=True)

    course = db.relationship('Course', backref='experiential_rel')
    student = db.relationship('Student', backref='experiential_rel')

class C133Projects(db.Model, AuditMixin):
    """Criteria 1.3.3 - Students undertaking project/field work/internships"""
    __tablename__ = 'c133_projects'

    id = db.Column(db.Integer, primary_key=True)
    program_id = db.Column(db.Integer, db.ForeignKey('program_lookup.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('student_lookup.id'), nullable=True)
    proof_links = db.Column(db.Text, nullable=True)

    student = db.relationship('Student', backref='projects_rel_v2')


# ==============================================================================
# CRITERIA 2 MODELS
# ==============================================================================

class C211Enrolment(db.Model, AuditMixin):
    __tablename__ = 'c211_enrolment'
    id = db.Column(db.Integer, primary_key=True)
    academic_year = db.Column(db.String(20), nullable=False)
    program_id = db.Column(db.Integer, db.ForeignKey('program_lookup.id'), nullable=False)
    sanctioned_seats = db.Column(db.Integer, nullable=True)
    admitted_students = db.Column(db.Integer, nullable=True)

class C212Reservation(db.Model, AuditMixin):
    __tablename__ = 'c212_reservation'
    id = db.Column(db.Integer, primary_key=True)
    year = db.Column(db.String(50), nullable=False)
    earmarked_sc = db.Column(db.Integer, nullable=True)
    earmarked_st = db.Column(db.Integer, nullable=True)
    earmarked_obc = db.Column(db.Integer, nullable=True)
    earmarked_gen = db.Column(db.Integer, nullable=True)
    earmarked_others = db.Column(db.Integer, nullable=True)
    admitted_sc = db.Column(db.Integer, nullable=True)
    admitted_st = db.Column(db.Integer, nullable=True)
    admitted_obc = db.Column(db.Integer, nullable=True)
    admitted_gen = db.Column(db.Integer, nullable=True)
    admitted_others = db.Column(db.Integer, nullable=True)
    supporting_document = db.Column(db.Text, nullable=True)

class C23OutgoingStudents(db.Model, AuditMixin):
    __tablename__ = 'c23_outgoing_students'
    id = db.Column(db.Integer, primary_key=True)
    year_of_passing = db.Column(db.String(50), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('student_lookup.id'), nullable=False)
    student = db.relationship('Student', backref='outgoing_rel')

class C233MentorRatio(db.Model, AuditMixin):
    __tablename__ = 'c233_mentor_ratio'
    id = db.Column(db.Integer, primary_key=True)
    academic_year = db.Column(db.String(20), nullable=False)
    branch = db.Column(db.String(100), nullable=False)
    first_year_count = db.Column(db.String(50), nullable=True)
    second_year_count = db.Column(db.String(50), nullable=True)
    third_year_count = db.Column(db.String(50), nullable=True)
    fourth_year_count = db.Column(db.String(50), nullable=True)
    total_students = db.Column(db.Integer, nullable=True)
    total_mentors = db.Column(db.Integer, nullable=True)
    mentor_ratio = db.Column(db.String(50), nullable=True)

class C241Teachers(db.Model, AuditMixin):
    __tablename__ = 'c241_teachers'
    id = db.Column(db.Integer, primary_key=True)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teacher_lookup.id'), nullable=False)
    year_of_appointment = db.Column(db.String(50), nullable=True)
    nature_of_appointment = db.Column(db.String(100), nullable=True)
    total_years_experience = db.Column(db.Float, nullable=True)
    is_still_serving = db.Column(db.Boolean, nullable=True, default=True)
    last_year_of_service = db.Column(db.String(50), nullable=True)
    teacher = db.relationship('Teacher', backref='appointment_rel')

class C242TeacherPhD(db.Model, AuditMixin):
    __tablename__ = 'c242_teacher_phd'
    id = db.Column(db.Integer, primary_key=True)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teacher_lookup.id'), nullable=False)
    qualification = db.Column(db.String(100), nullable=True)
    year_of_obtaining = db.Column(db.String(50), nullable=True)
    is_still_serving = db.Column(db.Boolean, nullable=True, default=True)
    last_year_of_service = db.Column(db.String(50), nullable=True)
    teacher = db.relationship('Teacher', backref='phd_rel')

class C263PassPercentage(db.Model, AuditMixin):
    __tablename__ = 'c263_pass_percentage'
    id = db.Column(db.Integer, primary_key=True)
    year = db.Column(db.String(50), nullable=False)
    program_id = db.Column(db.Integer, db.ForeignKey('program_lookup.id'), nullable=False)
    students_appeared = db.Column(db.Integer, nullable=True)
    students_passed = db.Column(db.Integer, nullable=True)

class C21Students(db.Model, AuditMixin):
    __tablename__ = 'c21_students'
    id = db.Column(db.Integer, primary_key=True)
    enrollment_year = db.Column(db.String(20), nullable=False)
    student_name = db.Column(db.String(255), nullable=False)
    enrollment_number = db.Column(db.String(100), nullable=False)
    enrollment_date = db.Column(db.Date, nullable=True)

class C22ReservedCategorySeats(db.Model, AuditMixin):
    __tablename__ = 'c22_reserved_category_seats'
    id = db.Column(db.Integer, primary_key=True)
    year = db.Column(db.String(20), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    reserved_seats = db.Column(db.Integer, nullable=False)
    document_link = db.Column(db.Text, nullable=True)


# ==============================================================================
# CRITERIA 3 MODELS
# ==============================================================================

class C3FullTimeTeachers(db.Model, AuditMixin):
    __tablename__ = 'c3_fulltime_teachers'
    id = db.Column(db.Integer, primary_key=True)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teacher_lookup.id'), nullable=False)
    academic_year = db.Column(db.String(20), nullable=False)
    sanctioned_posts = db.Column(db.Integer, nullable=True)
    teacher = db.relationship('Teacher', backref='c3_fulltime_rel')

class C3SanctionedPosts(db.Model, AuditMixin):
    __tablename__ = 'c3_sanctioned_posts'
    id = db.Column(db.Integer, primary_key=True)
    year = db.Column(db.String(50), nullable=False)
    sanctioned_posts_count = db.Column(db.Integer, nullable=True)
    supporting_document = db.Column(db.Text, nullable=True)

class C3ResearchProjects(db.Model, AuditMixin):
    __tablename__ = 'c3_research_projects'
    id = db.Column(db.Integer, primary_key=True)
    project_name = db.Column(db.String(255), nullable=False)
    pi_id = db.Column(db.Integer, db.ForeignKey('teacher_lookup.id'), nullable=True)
    co_investigator = db.Column(db.String(255), nullable=True)
    department = db.Column(db.String(255), nullable=True)
    year_of_award = db.Column(db.String(50), nullable=True)
    amount_sanctioned = db.Column(db.Numeric(12, 2), nullable=True)
    duration = db.Column(db.String(100), nullable=True)
    funding_agency = db.Column(db.String(255), nullable=True)
    funding_type = db.Column(db.String(50), nullable=True)
    pi = db.relationship('Teacher', backref='c3_research_rel')

class C313Events(db.Model, AuditMixin):
    __tablename__ = 'c313_events'
    id = db.Column(db.Integer, primary_key=True)
    year = db.Column(db.String(50), nullable=False)
    event_name = db.Column(db.String(255), nullable=False)
    participant_count = db.Column(db.Integer, nullable=True)
    date_from = db.Column(db.Date, nullable=True)
    date_to = db.Column(db.Date, nullable=True)
    activity_report_link = db.Column(db.Text, nullable=True)

class C321Papers(db.Model, AuditMixin):
    __tablename__ = 'c321_papers'
    id = db.Column(db.Integer, primary_key=True)
    paper_title = db.Column(db.String(500), nullable=False)
    author_names = db.Column(db.Text, nullable=True)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teacher_lookup.id'), nullable=True)
    department = db.Column(db.String(255), nullable=True)
    journal_name = db.Column(db.String(255), nullable=True)
    year_of_publication = db.Column(db.String(50), nullable=True)
    issn = db.Column(db.String(50), nullable=True)
    ugc_recognition_link = db.Column(db.Text, nullable=True)
    teacher = db.relationship('Teacher', backref='c321_papers_rel')

class C322Books(db.Model, AuditMixin):
    __tablename__ = 'c322_books'
    id = db.Column(db.Integer, primary_key=True)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teacher_lookup.id'), nullable=False)
    book_title = db.Column(db.String(500), nullable=True)
    chapter_title = db.Column(db.String(500), nullable=True)
    paper_title = db.Column(db.String(500), nullable=True)
    conference_name = db.Column(db.String(255), nullable=True)
    proceedings_title = db.Column(db.String(500), nullable=True)
    level = db.Column(db.String(50), nullable=True)
    year_of_publication = db.Column(db.String(50), nullable=True)
    isbn_issn = db.Column(db.String(50), nullable=True)
    affiliating_institute = db.Column(db.String(255), nullable=True)
    publisher = db.Column(db.String(255), nullable=True)
    teacher = db.relationship('Teacher', backref='c322_books_rel')

class C332ExtensionAwards(db.Model, AuditMixin):
    __tablename__ = 'c332_extension_awards'
    id = db.Column(db.Integer, primary_key=True)
    activity_name = db.Column(db.String(255), nullable=False)
    award_name = db.Column(db.String(255), nullable=True)
    awarding_body = db.Column(db.String(255), nullable=True)
    award_year = db.Column(db.String(50), nullable=True)

class C333Outreach(db.Model, AuditMixin):
    __tablename__ = 'c333_outreach'
    id = db.Column(db.Integer, primary_key=True)
    activity_name = db.Column(db.String(255), nullable=False)
    agency_name = db.Column(db.String(255), nullable=True)
    scheme_name = db.Column(db.String(255), nullable=True)
    year = db.Column(db.String(50), nullable=True)
    students_participated = db.Column(db.Integer, nullable=True)

class C341Collaborations(db.Model, AuditMixin):
    __tablename__ = 'c341_collaborations'
    id = db.Column(db.Integer, primary_key=True)
    activity_title = db.Column(db.String(255), nullable=False)
    agency_name = db.Column(db.String(255), nullable=True)
    participant_name = db.Column(db.String(255), nullable=True)
    year = db.Column(db.String(50), nullable=True)
    duration = db.Column(db.String(100), nullable=True)
    nature_of_activity = db.Column(db.String(255), nullable=True)
    proof_links = db.Column(db.Text, nullable=True)

class C342MoUs(db.Model, AuditMixin):
    __tablename__ = 'c342_mous'
    id = db.Column(db.Integer, primary_key=True)
    organisation_name = db.Column(db.String(255), nullable=False)
    institution_name = db.Column(db.String(255), nullable=True)
    signing_year = db.Column(db.String(50), nullable=True)
    duration = db.Column(db.String(100), nullable=True)
    activities_list = db.Column(db.Text, nullable=True)
    participant_count = db.Column(db.Integer, nullable=True)


# ==============================================================================
# CRITERIA 4 MODELS
# ==============================================================================

class C413ICTRooms(db.Model, AuditMixin):
    __tablename__ = 'c413_ict_rooms'
    id = db.Column(db.Integer, primary_key=True)
    room_number = db.Column(db.String(100), nullable=False)
    ict_facility_type = db.Column(db.String(255), nullable=True)
    geo_tagged_photo_link = db.Column(db.Text, nullable=True)

class C4Expenditure(db.Model, AuditMixin):
    __tablename__ = 'c4_expenditure'
    id = db.Column(db.Integer, primary_key=True)
    year = db.Column(db.String(50), nullable=False)
    budget_infra = db.Column(db.Numeric(12, 2), nullable=True)
    expenditure_infra = db.Column(db.Numeric(12, 2), nullable=True)
    total_expenditure_excl_salary = db.Column(db.Numeric(12, 2), nullable=True)
    expenditure_academic_maint = db.Column(db.Numeric(12, 2), nullable=True)
    expenditure_physical_maint = db.Column(db.Numeric(12, 2), nullable=True)

class C42Library(db.Model, AuditMixin):
    __tablename__ = 'c42_library'
    id = db.Column(db.Integer, primary_key=True)
    academic_year = db.Column(db.String(20), nullable=False)
    resource_type = db.Column(db.String(100), nullable=True)
    membership_details = db.Column(db.Text, nullable=True)
    expenditure_ejournals = db.Column(db.Numeric(12, 2), nullable=True)
    expenditure_eresources = db.Column(db.Numeric(12, 2), nullable=True)
    total_library_expenditure = db.Column(db.Numeric(12, 2), nullable=True)
    proof_links = db.Column(db.Text, nullable=True)


# ==============================================================================
# CRITERIA 5 MODELS
# ==============================================================================

class C511Scholarships(db.Model, AuditMixin):
    __tablename__ = 'c511_scholarships'
    id = db.Column(db.Integer, primary_key=True)
    year = db.Column(db.String(50), nullable=False)
    scheme_name = db.Column(db.String(255), nullable=False)
    gov_student_count = db.Column(db.Integer, nullable=True)
    gov_amount = db.Column(db.Numeric(12, 2), nullable=True)
    inst_student_count = db.Column(db.Integer, nullable=True)
    inst_amount = db.Column(db.Numeric(12, 2), nullable=True)
    proof_links = db.Column(db.Text, nullable=True)

class C513SkillInitiatives(db.Model, AuditMixin):
    __tablename__ = 'c513_skill_initiatives'
    id = db.Column(db.Integer, primary_key=True)
    program_name = db.Column(db.String(255), nullable=False)
    implementation_date = db.Column(db.Date, nullable=True)
    students_enrolled = db.Column(db.Integer, nullable=True)
    agencies_involved = db.Column(db.Text, nullable=True)
    year = db.Column(db.String(20), nullable=True)
    proof_links = db.Column(db.Text, nullable=True)

class C514CompetitiveExams(db.Model, AuditMixin):
    __tablename__ = 'c514_competitive_exams'
    id = db.Column(db.Integer, primary_key=True)
    year = db.Column(db.String(50), nullable=False)
    exam_activity_name = db.Column(db.String(255), nullable=True)
    exam_students_count = db.Column(db.Integer, nullable=True)
    counseling_activity_name = db.Column(db.String(255), nullable=True)
    counseling_students_count = db.Column(db.Integer, nullable=True)
    students_placed = db.Column(db.Integer, nullable=True)
    proof_links = db.Column(db.Text, nullable=True)

class C521Placements(db.Model, AuditMixin):
    __tablename__ = 'c521_placements'
    id = db.Column(db.Integer, primary_key=True)
    year = db.Column(db.String(50), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('student_lookup.id'), nullable=False)
    program_graduated = db.Column(db.String(255), nullable=True)
    employer_name = db.Column(db.String(255), nullable=True)
    employer_contact = db.Column(db.String(255), nullable=True)
    pay_package = db.Column(db.Numeric(12, 2), nullable=True)
    student = db.relationship('Student', backref='placements_rel_v2')

class C522HigherEd(db.Model, AuditMixin):
    __tablename__ = 'c522_higher_ed'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student_lookup.id'), nullable=False)
    program_graduated = db.Column(db.String(255), nullable=True)
    institution_joined = db.Column(db.String(255), nullable=True)
    program_admitted = db.Column(db.String(255), nullable=True)
    student = db.relationship('Student', backref='higher_ed_rel_v2')

class C523QualifyingExams(db.Model, AuditMixin):
    __tablename__ = 'c523_qualifying_exams'
    id = db.Column(db.Integer, primary_key=True)
    year = db.Column(db.String(50), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('student_lookup.id'), nullable=False)
    registration_number = db.Column(db.String(100), nullable=True)
    exam_type = db.Column(db.String(100), nullable=True)
    student = db.relationship('Student', backref='qualifying_rel_v2')

class C531SportsAwards(db.Model, AuditMixin):
    __tablename__ = 'c531_sports_awards'
    id = db.Column(db.Integer, primary_key=True)
    year = db.Column(db.String(50), nullable=False)
    award_name = db.Column(db.String(255), nullable=False)
    team_or_individual = db.Column(db.String(20), nullable=True)
    level = db.Column(db.String(50), nullable=True)
    activity_type = db.Column(db.String(20), nullable=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student_lookup.id'), nullable=True)
    student = db.relationship('Student', backref='sports_awards_rel_v2')

class C533SportsEvents(db.Model, AuditMixin):
    __tablename__ = 'c533_sports_events'
    id = db.Column(db.Integer, primary_key=True)
    event_date = db.Column(db.Date, nullable=True)
    event_name = db.Column(db.String(255), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('student_lookup.id'), nullable=False)
    student = db.relationship('Student', backref='sports_participation_rel_v2')


# ==============================================================================
# CRITERIA 6 MODELS
# ==============================================================================

class C623EGovernance(db.Model, AuditMixin):
    __tablename__ = 'c623_egovernance'
    id = db.Column(db.Integer, primary_key=True)
    area = db.Column(db.String(100), nullable=False)
    vendor_name = db.Column(db.String(255), nullable=True)
    vendor_contact = db.Column(db.String(255), nullable=True)
    year_of_implementation = db.Column(db.String(50), nullable=True)

class C632TeacherFinancial(db.Model, AuditMixin):
    __tablename__ = 'c632_teacher_financial'
    id = db.Column(db.Integer, primary_key=True)
    year = db.Column(db.String(50), nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teacher_lookup.id'), nullable=False)
    conference_name = db.Column(db.String(255), nullable=True)
    professional_body = db.Column(db.String(255), nullable=True)
    amount = db.Column(db.Numeric(12, 2), nullable=True)
    teacher = db.relationship('Teacher', backref='financial_rel_v2')

class C633StaffTraining(db.Model, AuditMixin):
    __tablename__ = 'c633_staff_training'
    id = db.Column(db.Integer, primary_key=True)
    date_from = db.Column(db.Date, nullable=True)
    date_to = db.Column(db.Date, nullable=True)
    dates_from_to = db.Column(db.String(200), nullable=True)
    teaching_program_title = db.Column(db.String(255), nullable=True)
    non_teaching_program_title = db.Column(db.String(255), nullable=True)
    participant_count = db.Column(db.Integer, nullable=True)

class C634TeacherFDP(db.Model, AuditMixin):
    __tablename__ = 'c634_teacher_fdp'
    id = db.Column(db.Integer, primary_key=True)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teacher_lookup.id'), nullable=False)
    program_title = db.Column(db.String(255), nullable=False)
    duration_from = db.Column(db.Date, nullable=True)
    duration_to = db.Column(db.Date, nullable=True)
    duration_from_to = db.Column(db.String(200), nullable=True)
    teacher = db.relationship('Teacher', backref='fdp_rel_v2')

class C642NonGovGrants(db.Model, AuditMixin):
    __tablename__ = 'c642_non_gov_grants'
    id = db.Column(db.Integer, primary_key=True)
    year = db.Column(db.String(50), nullable=False)
    agency_name = db.Column(db.String(255), nullable=False)
    purpose = db.Column(db.Text, nullable=True)
    amount_received = db.Column(db.Numeric(12, 2), nullable=True)
    audited_statement_link = db.Column(db.Text, nullable=True)

class C653QualityInitiatives(db.Model, AuditMixin):
    __tablename__ = 'c653_quality_initiatives'
    id = db.Column(db.Integer, primary_key=True)
    year = db.Column(db.String(50), nullable=False)
    conferences_conducted = db.Column(db.Text, nullable=True)
    aaa_status = db.Column(db.Text, nullable=True)
    nirf_status = db.Column(db.Text, nullable=True)
    iso_certification = db.Column(db.String(255), nullable=True)
    iso_validity_period = db.Column(db.String(100), nullable=True)
    nba_certification = db.Column(db.Text, nullable=True)
    collaborative_initiatives = db.Column(db.Text, nullable=True)
    orientation_program = db.Column(db.Text, nullable=True)
    orientation_date_from = db.Column(db.Date, nullable=True)
    orientation_date_to = db.Column(db.Date, nullable=True)


# ==============================================================================
# ALIASES FOR COMPATIBILITY
# ==============================================================================
# Some parts of the app use underscores, some don't.
C11_Courses = C11Courses
C113_TeacherBodies = C113TeacherBodies
C121_CBCS = C121CBCS
C122_Addon = C122Addon
C132_Experiential = C132Experiential
C133_Projects = C133Projects
C211_Enrolment = C211Enrolment
C212_Reservation = C212Reservation
C23_OutgoingStudents = C23OutgoingStudents
C233_MentorRatio = C233MentorRatio
C241_Teachers = C241Teachers
C242_TeacherPhD = C242TeacherPhD
C263_PassPercentage = C263PassPercentage
C521_Placements = C521Placements
C522_Higher_Ed = C522HigherEd
C523_Qualifying_Exams = C523QualifyingExams
C531_Sports_Awards = C531SportsAwards
C533_Sports_Events = C533SportsEvents
C632_Teacher_Financial = C632TeacherFinancial
C634_Teacher_FDP = C634TeacherFDP
C21_Students = C21Students
C22_ReservedCategorySeats = C22ReservedCategorySeats

