from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

def init_db(app):
    db.init_app(app)
    with app.app_context():
        db.create_all()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    applications = db.relationship('Application', backref='user', lazy=True, cascade="all, delete-orphan")

class Application(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # Personal Details
    first_name = db.Column(db.String(100))
    middle_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    contact_number = db.Column(db.String(20))
    gender = db.Column(db.String(10))
    
    # Academic Details
    final_percentage = db.Column(db.Float)
    tentative_ranking = db.Column(db.String(20))
    final_year_project = db.Column(db.Text)
    other_projects = db.Column(db.Text)
    publications = db.Column(db.Text)
    
    # Additional Information
    extracurricular = db.Column(db.Text)
    professional_experience = db.Column(db.Text)
    strong_points = db.Column(db.Text)
    weak_points = db.Column(db.Text)
    
    # File Uploads
    transcript = db.Column(db.String(200))
    cv = db.Column(db.String(200))
    photo = db.Column(db.String(200))
    
    # Additional Fields
    preferred_programs = db.Column(db.Text)
    references = db.Column(db.Text)
    statement_of_purpose = db.Column(db.Text)
    intended_research_areas = db.Column(db.Text)
    english_proficiency = db.Column(db.String(50))
    leadership_experience = db.Column(db.Text)
    availability_to_start = db.Column(db.String(50))
    additional_certifications = db.Column(db.Text)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)