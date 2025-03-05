from flask import Flask, request, jsonify, session
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os
import logging
from models import db, User, Application, init_db
import base64
from datetime import datetime

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config['SECRET_KEY'] = 'yoursecretkey'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///applicants.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'  # Added for CORS support with cookies
app.config['SESSION_COOKIE_SECURE'] = False  # Set to True in production with HTTPS

# Create upload folder if it doesn't exist
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

# Initialize database
init_db(app)
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    logger.debug(f"Register request received with data: {data}")
    
    # Check if user already exists
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        logger.warning(f"User already exists: {data['email']}")
        return jsonify({'message': 'User already exists'}), 400
    
    # Create new user
    try:
        hashed_password = generate_password_hash(data['password'], method='sha256')
        new_user = User(
            email=data['email'],
            password=hashed_password,
            is_admin=data.get('is_admin', False),
            created_at=datetime.strptime('2025-03-05 19:30:39', '%Y-%m-%d %H:%M:%S')  # Using provided time
        )
        
        db.session.add(new_user)
        db.session.commit()
        logger.info(f"User created successfully: {data['email']}")
        
        return jsonify({'message': 'User created successfully', 'user_id': new_user.id}), 201
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error creating user: {str(e)}")
        return jsonify({'message': f'Failed to create user: {str(e)}'}), 500

@app.route('/api/admin/create-student', methods=['POST'])
def admin_create_student():
    logger.debug("Admin create student request received")
    if 'user_id' not in session or not session.get('is_admin', False):
        logger.warning("Unauthorized attempt to create student")
        return jsonify({'message': 'Unauthorized'}), 401
    
    data = request.json
    logger.debug(f"Create student data: {data}")
    
    # Check if user already exists
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        logger.warning(f"User already exists: {data['email']}")
        return jsonify({'message': 'User already exists'}), 400
    
    # Create a random password for the student
    import random
    import string
    random_password = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(12))
    
    try:
        # Create new user
        hashed_password = generate_password_hash(random_password, method='sha256')
        new_user = User(
            email=data['email'],
            password=hashed_password,
            is_admin=False,
            created_at=datetime.strptime('2025-03-05 19:30:39', '%Y-%m-%d %H:%M:%S')  # Using provided time
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        # Create blank application record for the student
        current_time = datetime.strptime('2025-03-05 19:30:39', '%Y-%m-%d %H:%M:%S')  # Using provided time
        new_application = Application(
            user_id=new_user.id,
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', ''),
            contact_number=data.get('contact_number', ''),
            created_at=current_time,
            updated_at=current_time
        )
        
        db.session.add(new_application)
        db.session.commit()
        
        logger.info(f"Student created successfully: {data['email']}")
        return jsonify({
            'message': 'Student created successfully', 
            'user_id': new_user.id,
            'application_id': new_application.id,
            'temp_password': random_password
        }), 201
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error creating student: {str(e)}")
        return jsonify({'message': f'Failed to create student: {str(e)}'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    logger.debug(f"Login attempt for: {data['email']}")
    
    try:
        user = User.query.filter_by(email=data['email']).first()
        
        if not user:
            logger.warning(f"Login failed - user not found: {data['email']}")
            return jsonify({'message': 'Invalid credentials'}), 401
        
        if not check_password_hash(user.password, data['password']):
            logger.warning(f"Login failed - invalid password for: {data['email']}")
            return jsonify({'message': 'Invalid credentials'}), 401
        
        session.clear()
        session['user_id'] = user.id
        session['is_admin'] = user.is_admin
        
        logger.info(f"Login successful for: {data['email']}, admin: {user.is_admin}")
        return jsonify({
            'message': 'Login successful',
            'user_id': user.id,
            'is_admin': user.is_admin
        }), 200
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return jsonify({'message': f'Login error: {str(e)}'}), 500

@app.route('/api/logout', methods=['POST'])
def logout():
    logger.debug(f"Logout request for user_id: {session.get('user_id')}")
    session.pop('user_id', None)
    session.pop('is_admin', None)
    return jsonify({'message': 'Logout successful'}), 200

@app.route('/api/check-auth', methods=['GET'])
def check_auth():
    logger.debug(f"Check auth request: user_id in session: {'user_id' in session}")
    if 'user_id' in session:
        logger.info(f"User authenticated: {session['user_id']}, is_admin: {session.get('is_admin', False)}")
        return jsonify({
            'authenticated': True,
            'user_id': session['user_id'],
            'is_admin': session.get('is_admin', False)
        }), 200
    logger.warning("User not authenticated")
    return jsonify({'authenticated': False}), 401

@app.route('/api/submit-application', methods=['POST'])
def submit_application():
    if 'user_id' not in session:
        return jsonify({'message': 'Unauthorized'}), 401
    
    user_id = session['user_id']
    data = request.json
    
    # Check if user already has an application
    existing_application = Application.query.filter_by(user_id=user_id).first()
    
    current_time = datetime.strptime('2025-03-05 19:30:39', '%Y-%m-%d %H:%M:%S')  # Using provided time
    
    if existing_application:
        # Update existing application
        for key, value in data.items():
            if hasattr(existing_application, key):
                setattr(existing_application, key, value)
        
        existing_application.updated_at = current_time
        db.session.commit()
        return jsonify({'message': 'Application updated successfully'}), 200
    
    # Create new application
    new_application = Application(
        user_id=user_id,
        first_name=data.get('first_name'),
        middle_name=data.get('middle_name'),
        last_name=data.get('last_name'),
        contact_number=data.get('contact_number'),
        gender=data.get('gender'),
        final_percentage=data.get('final_percentage'),
        tentative_ranking=data.get('tentative_ranking'),
        final_year_project=data.get('final_year_project'),
        other_projects=data.get('other_projects'),
        publications=data.get('publications'),
        extracurricular=data.get('extracurricular'),
        professional_experience=data.get('professional_experience'),
        strong_points=data.get('strong_points'),
        weak_points=data.get('weak_points'),
        transcript=data.get('transcript'),
        cv=data.get('cv'),
        photo=data.get('photo'),
        preferred_programs=data.get('preferred_programs'),
        references=data.get('references'),
        statement_of_purpose=data.get('statement_of_purpose'),
        intended_research_areas=data.get('intended_research_areas'),
        english_proficiency=data.get('english_proficiency'),
        leadership_experience=data.get('leadership_experience'),
        availability_to_start=data.get('availability_to_start'),
        additional_certifications=data.get('additional_certifications'),
        created_at=current_time,
        updated_at=current_time
    )
    
    db.session.add(new_application)
    db.session.commit()
    
    return jsonify({'message': 'Application submitted successfully'}), 201

@app.route('/api/upload-file', methods=['POST'])
def upload_file():
    if 'user_id' not in session:
        return jsonify({'message': 'Unauthorized'}), 401
    
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400
    
    file = request.files['file']
    file_type = request.form.get('type')
    
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400
    
    if file:
        filename = secure_filename(f"{session['user_id']}_{file_type}_{file.filename}")
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        # Update the application with the file path
        # Update the application with the file path
        application = Application.query.filter_by(user_id=session['user_id']).first()
        if application:
            if file_type == 'transcript':
                application.transcript = file_path
            elif file_type == 'cv':
                application.cv = file_path
            elif file_type == 'photo':
                application.photo = file_path
            
            application.updated_at = datetime.strptime('2025-03-05 19:32:42', '%Y-%m-%d %H:%M:%S')  # Updated time
            db.session.commit()
        
        return jsonify({'message': 'File uploaded successfully', 'path': file_path}), 200

@app.route('/api/get-application', methods=['GET'])
def get_application():
    if 'user_id' not in session:
        logger.warning("Unauthorized attempt to get application")
        return jsonify({'message': 'Unauthorized'}), 401
    
    user_id = request.args.get('user_id', session['user_id'])
    logger.debug(f"Get application request for user_id: {user_id}")
    
    # Only allow admins to view other applications
    if str(user_id) != str(session['user_id']) and not session.get('is_admin', False):
        logger.warning(f"Unauthorized attempt to view another user's application: {user_id}")
        return jsonify({'message': 'Unauthorized'}), 401
    
    application = Application.query.filter_by(user_id=user_id).first()
    
    if not application:
        logger.warning(f"Application not found for user_id: {user_id}")
        return jsonify({'message': 'Application not found'}), 404
    
    # Convert to dictionary
    application_data = application_to_dict(application)
    logger.info(f"Application data retrieved for user_id: {user_id}")
    
    return jsonify(application_data), 200

@app.route('/api/get-application/<int:application_id>', methods=['GET'])
def get_application_by_id(application_id):
    """Get application by application ID instead of user ID"""
    if 'user_id' not in session or not session.get('is_admin', False):
        logger.warning("Unauthorized attempt to get application by ID")
        return jsonify({'message': 'Unauthorized'}), 401
    
    logger.debug(f"Get application request by ID: {application_id}")
    application = Application.query.get(application_id)
    
    if not application:
        logger.warning(f"Application not found for ID: {application_id}")
        return jsonify({'message': 'Application not found'}), 404
    
    # Convert to dictionary
    application_data = application_to_dict(application)
    logger.info(f"Application data retrieved for ID: {application_id}")
    
    return jsonify(application_data), 200

def application_to_dict(application):
    """Helper function to convert application object to dictionary"""
    return {
        'id': application.id,
        'user_id': application.user_id,
        'first_name': application.first_name,
        'middle_name': application.middle_name,
        'last_name': application.last_name,
        'contact_number': application.contact_number,
        'gender': application.gender,
        'final_percentage': application.final_percentage,
        'tentative_ranking': application.tentative_ranking,
        'final_year_project': application.final_year_project,
        'other_projects': application.other_projects,
        'publications': application.publications,
        'extracurricular': application.extracurricular,
        'professional_experience': application.professional_experience,
        'strong_points': application.strong_points,
        'weak_points': application.weak_points,
        'transcript': application.transcript,
        'cv': application.cv,
        'photo': application.photo,
        'preferred_programs': application.preferred_programs,
        'references': application.references,
        'statement_of_purpose': application.statement_of_purpose,
        'intended_research_areas': application.intended_research_areas,
        'english_proficiency': application.english_proficiency,
        'leadership_experience': application.leadership_experience,
        'availability_to_start': application.availability_to_start,
        'additional_certifications': application.additional_certifications,
        'created_at': application.created_at.isoformat(),
        'updated_at': application.updated_at.isoformat() if application.updated_at else None
    }

@app.route('/api/get-all-applications', methods=['GET'])
def get_all_applications():
    if 'user_id' not in session or not session.get('is_admin', False):
        logger.warning("Unauthorized attempt to get all applications")
        return jsonify({'message': 'Unauthorized'}), 401
    
    logger.debug("Get all applications request")
    applications = Application.query.all()
    
    applications_data = []
    for application in applications:
        user = User.query.get(application.user_id)
        applications_data.append({
            'id': application.id,
            'user_id': application.user_id,
            'email': user.email if user else 'Unknown',
            'first_name': application.first_name,
            'last_name': application.last_name,
            'contact_number': application.contact_number,
            'gender': application.gender,
            'final_percentage': application.final_percentage,
            'created_at': application.created_at.isoformat(),
            'updated_at': application.updated_at.isoformat() if application.updated_at else None
        })
    
    logger.info(f"Retrieved {len(applications_data)} applications")
    return jsonify(applications_data), 200

@app.route('/api/update-application/<int:application_id>', methods=['PUT'])
def update_application(application_id):
    if 'user_id' not in session or not session.get('is_admin', False):
        logger.warning("Unauthorized attempt to update application")
        return jsonify({'message': 'Unauthorized'}), 401
    
    logger.debug(f"Update application request for ID: {application_id}")
    application = Application.query.get(application_id)
    
    if not application:
        logger.warning(f"Application not found for ID: {application_id}")
        return jsonify({'message': 'Application not found'}), 404
    
    data = request.json
    
    # Update only the fields that are sent and exist in the model
    for key, value in data.items():
        if hasattr(application, key) and key not in ['id', 'user_id', 'created_at', 'updated_at']:
            # Handle numeric fields specially
            if key == 'final_percentage' and value is not None:
                try:
                    setattr(application, key, float(value))
                except (ValueError, TypeError):
                    # If conversion fails, use the original value
                    logger.warning(f"Failed to convert final_percentage value: {value}")
                    pass
            else:
                setattr(application, key, value)
    
    # Update the timestamp
    application.updated_at = datetime.strptime('2025-03-05 19:32:42', '%Y-%m-%d %H:%M:%S')  # Updated time
    
    try:
        db.session.commit()
        logger.info(f"Application updated successfully: {application_id}")
        return jsonify({'message': 'Application updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        logger.error(f"Failed to update application: {str(e)}")
        return jsonify({'message': f'Failed to update application: {str(e)}'}), 500

@app.route('/api/delete-application/<int:application_id>', methods=['DELETE'])
def delete_application(application_id):
    if 'user_id' not in session or not session.get('is_admin', False):
        logger.warning("Unauthorized attempt to delete application")
        return jsonify({'message': 'Unauthorized'}), 401
    
    logger.debug(f"Delete application request for ID: {application_id}")
    application = Application.query.get(application_id)
    
    if not application:
        logger.warning(f"Application not found for ID: {application_id}")
        return jsonify({'message': 'Application not found'}), 404
    
    try:
        db.session.delete(application)
        db.session.commit()
        logger.info(f"Application deleted successfully: {application_id}")
        return jsonify({'message': 'Application deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        logger.error(f"Failed to delete application: {str(e)}")
        return jsonify({'message': f'Failed to delete application: {str(e)}'}), 500

@app.route('/api/admin/users', methods=['GET'])
def get_all_users():
    if 'user_id' not in session or not session.get('is_admin', False):
        logger.warning("Unauthorized attempt to get all users")
        return jsonify({'message': 'Unauthorized'}), 401
    
    logger.debug("Get all users request")
    users = User.query.filter(User.is_admin == False).all()
    
    users_data = []
    for user in users:
        application = Application.query.filter_by(user_id=user.id).first()
        users_data.append({
            'id': user.id,
            'email': user.email,
            'created_at': user.created_at.isoformat(),
            'has_application': application is not None,
            'application_id': application.id if application else None,
            'first_name': application.first_name if application else '',
            'last_name': application.last_name if application else ''
        })
    
    logger.info(f"Retrieved {len(users_data)} users")
    return jsonify(users_data), 200

@app.route('/api/admin/reset-password/<int:user_id>', methods=['POST'])
def reset_user_password(user_id):
    if 'user_id' not in session or not session.get('is_admin', False):
        logger.warning("Unauthorized attempt to reset password")
        return jsonify({'message': 'Unauthorized'}), 401
    
    logger.debug(f"Reset password request for user_id: {user_id}")
    user = User.query.get(user_id)
    
    if not user:
        logger.warning(f"User not found for ID: {user_id}")
        return jsonify({'message': 'User not found'}), 404
    
    # Generate a random password
    import random
    import string
    random_password = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(12))
    
    # Update the user's password
    user.password = generate_password_hash(random_password, method='sha256')
    db.session.commit()
    
    logger.info(f"Password reset successfully for user_id: {user_id}")
    return jsonify({
        'message': 'Password reset successfully',
        'temp_password': random_password
    }), 200

# Add current user information for debugging purposes
@app.route('/api/debug/current-user', methods=['GET'])
def debug_current_user():
    logger.debug("Debug current user request")
    if 'user_id' in session:
        user = User.query.get(session['user_id'])
        if user:
            return jsonify({
                'user_id': user.id,
                'email': user.email,
                'is_admin': user.is_admin,
                'current_time': datetime.strptime('2025-03-05 19:32:42', '%Y-%m-%d %H:%M:%S').strftime('%Y-%m-%d %H:%M:%S')  # Updated time
            }), 200
    
    return jsonify({
        'message': 'No user logged in',
        'current_time': datetime.strptime('2025-03-05 19:32:42', '%Y-%m-%d %H:%M:%S').strftime('%Y-%m-%d %H:%M:%S')  # Updated time
    }), 200

# Function to create initial admin user if it doesn't exist
@app.before_first_request
def create_initial_users():
    """Create initial admin and student users if they don't exist."""
    try:
        # Check if admin user exists
        admin_user = User.query.filter_by(email='admin@example.com').first()
        if not admin_user:
            admin_password = generate_password_hash('admin123', method='sha256')
            admin = User(
                email='admin@example.com',
                password=admin_password,
                is_admin=True,
                created_at=datetime.strptime('2025-03-05 19:32:42', '%Y-%m-%d %H:%M:%S')  # Updated time
            )
            db.session.add(admin)
            logger.info("Created admin user: admin@example.com")
            
        # Check if example student user exists
        student_user = User.query.filter_by(email='student@example.com').first()
        if not student_user:
            student_password = generate_password_hash('student123', method='sha256')
            student = User(
                email='student@example.com',
                password=student_password,
                is_admin=False,
                created_at=datetime.strptime('2025-03-05 19:32:42', '%Y-%m-%d %H:%M:%S')  # Updated time
            )
            db.session.add(student)
            db.session.commit()
            
            # Create application for the student
            student_app = Application(
                user_id=student.id,
                first_name='Test',
                last_name='Student',
                contact_number='1234567890',
                gender='Other',
                created_at=datetime.strptime('2025-03-05 19:32:42', '%Y-%m-%d %H:%M:%S'),  # Updated time
                updated_at=datetime.strptime('2025-03-05 19:32:42', '%Y-%m-%d %H:%M:%S')  # Updated time
            )
            db.session.add(student_app)
            logger.info("Created student user: student@example.com")
        
        # Create user for shreyaupretyy if it doesn't exist
        shreya_user = User.query.filter_by(email='shreya@example.com').first()
        if not shreya_user:
            shreya_password = generate_password_hash('password123', method='sha256')
            shreya = User(
                email='shreya@example.com',
                password=shreya_password,
                is_admin=True,  # Make this an admin
                created_at=datetime.strptime('2025-03-05 19:32:42', '%Y-%m-%d %H:%M:%S')  # Updated time
            )
            db.session.add(shreya)
            db.session.commit()
            logger.info("Created user: shreya@example.com (shreyaupretyy)")
        
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error creating initial users: {str(e)}")

if __name__ == '__main__':
    app.run(debug=True, port=5000)