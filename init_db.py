from app import db, app, Usuario
from werkzeug.security import generate_password_hash

with app.app_context():
    db.create_all()
    if not Usuario.query.filter_by(rol='admin').first():
        admin = Usuario(username='admin', password=generate_password_hash('admin123'), rol='admin')
        db.session.add(admin)
        db.session.commit()
    print("Base de datos creada con usuario admin.")
