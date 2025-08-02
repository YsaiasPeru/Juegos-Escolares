from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'tu_clave_secreta_aqui'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///juegos_escolares.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# Modelos de la base de datos
class Admin(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

class Equipo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    color_uniforme = db.Column(db.String(50))
    fecha_registro = db.Column(db.DateTime, default=datetime.utcnow)
    lider_id = db.Column(db.Integer, db.ForeignKey('jugador.id'))
    jugadores = db.relationship('Jugador', foreign_keys='Jugador.equipo_id', backref='equipo', lazy=True)
    partidos_local = db.relationship('Partido', foreign_keys='Partido.equipo_local_id', backref='equipo_local')
    partidos_visitante = db.relationship('Partido', foreign_keys='Partido.equipo_visitante_id', backref='equipo_visitante')

class Jugador(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    dni = db.Column(db.String(20), unique=True, nullable=False)
    nombre = db.Column(db.String(100), nullable=False)
    apellido = db.Column(db.String(100), nullable=False)
    numero_telefono = db.Column(db.String(20))
    posicion = db.Column(db.String(50))
    equipo_id = db.Column(db.Integer, db.ForeignKey('equipo.id'))
    es_lider = db.Column(db.Boolean, default=False)
    fecha_registro = db.Column(db.DateTime, default=datetime.utcnow)

class Partido(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    equipo_local_id = db.Column(db.Integer, db.ForeignKey('equipo.id'), nullable=False)
    equipo_visitante_id = db.Column(db.Integer, db.ForeignKey('equipo.id'), nullable=False)
    fecha_partido = db.Column(db.DateTime, nullable=False)
    goles_local = db.Column(db.Integer, default=0)
    goles_visitante = db.Column(db.Integer, default=0)
    estado = db.Column(db.String(20), default='programado')  # programado, en_curso, finalizado
    fase = db.Column(db.String(20), default='grupos')  # grupos, octavos, cuartos, semifinal, final
    grupo = db.Column(db.String(10))  # A, B, C, D, etc.
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)

@login_manager.user_loader
def load_user(user_id):
    return Admin.query.get(int(user_id))

# Rutas principales
@app.route('/')
def index():
    equipos = Equipo.query.all()
    proximos_partidos = Partido.query.filter_by(estado='programado').order_by(Partido.fecha_partido).limit(5).all()
    return render_template('index.html', equipos=equipos, proximos_partidos=proximos_partidos)

@app.route('/admin')
@login_required
def admin_dashboard():
    equipos = Equipo.query.all()
    jugadores = Jugador.query.all()
    partidos = Partido.query.all()
    return render_template('admin/dashboard.html', equipos=equipos, jugadores=jugadores, partidos=partidos)

# Rutas de autenticación
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        admin = Admin.query.filter_by(username=username).first()
        
        if admin and check_password_hash(admin.password_hash, password):
            login_user(admin)
            return redirect(url_for('admin_dashboard'))
        else:
            flash('Usuario o contraseña incorrectos')
    
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

# Rutas para gestión de equipos
@app.route('/admin/equipos')
@login_required
def admin_equipos():
    equipos = Equipo.query.all()
    return render_template('admin/equipos.html', equipos=equipos)

@app.route('/admin/equipos/nuevo', methods=['GET', 'POST'])
@login_required
def nuevo_equipo():
    if request.method == 'POST':
        nombre = request.form['nombre']
        color_uniforme = request.form['color_uniforme']
        
        equipo = Equipo(nombre=nombre, color_uniforme=color_uniforme)
        db.session.add(equipo)
        db.session.commit()
        
        flash('Equipo creado exitosamente')
        return redirect(url_for('admin_equipos'))
    
    return render_template('admin/nuevo_equipo.html')

@app.route('/admin/equipos/<int:equipo_id>')
@login_required
def ver_equipo(equipo_id):
    equipo = Equipo.query.get_or_404(equipo_id)
    return render_template('admin/ver_equipo.html', equipo=equipo)

# Rutas para gestión de jugadores
@app.route('/admin/jugadores')
@login_required
def admin_jugadores():
    jugadores = Jugador.query.all()
    equipos = Equipo.query.all()
    return render_template('admin/jugadores.html', jugadores=jugadores, equipos=equipos)

@app.route('/admin/jugadores/nuevo', methods=['GET', 'POST'])
@login_required
def nuevo_jugador():
    if request.method == 'POST':
        dni = request.form['dni']
        nombre = request.form['nombre']
        apellido = request.form['apellido']
        numero_telefono = request.form['numero_telefono']
        posicion = request.form['posicion']
        equipo_id = request.form['equipo_id']
        es_lider = 'es_lider' in request.form
        
        # Verificar si el DNI ya existe
        if Jugador.query.filter_by(dni=dni).first():
            flash('El DNI ya está registrado')
            return redirect(url_for('nuevo_jugador'))
        
        jugador = Jugador(
            dni=dni,
            nombre=nombre,
            apellido=apellido,
            numero_telefono=numero_telefono,
            posicion=posicion,
            equipo_id=equipo_id if equipo_id else None,
            es_lider=es_lider
        )
        
        db.session.add(jugador)
        db.session.commit()
        
        flash('Jugador registrado exitosamente')
        return redirect(url_for('admin_jugadores'))
    
    equipos = Equipo.query.all()
    return render_template('admin/nuevo_jugador.html', equipos=equipos)

# Rutas para gestión de partidos
@app.route('/admin/partidos')
@login_required
def admin_partidos():
    partidos = Partido.query.order_by(Partido.fecha_partido).all()
    equipos = Equipo.query.all()
    return render_template('admin/partidos.html', partidos=partidos, equipos=equipos)

@app.route('/admin/partidos/nuevo', methods=['GET', 'POST'])
@login_required
def nuevo_partido():
    if request.method == 'POST':
        equipo_local_id = request.form['equipo_local_id']
        equipo_visitante_id = request.form['equipo_visitante_id']
        fecha_partido = datetime.strptime(request.form['fecha_partido'], '%Y-%m-%dT%H:%M')
        fase = request.form['fase']
        grupo = request.form.get('grupo', '')
        
        partido = Partido(
            equipo_local_id=equipo_local_id,
            equipo_visitante_id=equipo_visitante_id,
            fecha_partido=fecha_partido,
            fase=fase,
            grupo=grupo
        )
        
        db.session.add(partido)
        db.session.commit()
        
        flash('Partido programado exitosamente')
        return redirect(url_for('admin_partidos'))
    
    equipos = Equipo.query.all()
    return render_template('admin/nuevo_partido.html', equipos=equipos)

@app.route('/admin/partidos/<int:partido_id>/resultado', methods=['POST'])
@login_required
def actualizar_resultado(partido_id):
    partido = Partido.query.get_or_404(partido_id)
    partido.goles_local = int(request.form['goles_local'])
    partido.goles_visitante = int(request.form['goles_visitante'])
    partido.estado = 'finalizado'
    
    db.session.commit()
    flash('Resultado actualizado exitosamente')
    return redirect(url_for('admin_partidos'))

# Rutas para vista pública
@app.route('/fixture')
def fixture():
    partidos = Partido.query.order_by(Partido.fecha_partido).all()
    return render_template('fixture.html', partidos=partidos)

@app.route('/equipos')
def equipos_publico():
    equipos = Equipo.query.all()
    return render_template('equipos.html', equipos=equipos)

@app.route('/equipos/<int:equipo_id>')
def ver_equipo_publico(equipo_id):
    equipo = Equipo.query.get_or_404(equipo_id)
    return render_template('ver_equipo_publico.html', equipo=equipo)

# API para obtener datos
@app.route('/api/equipos')
def api_equipos():
    equipos = Equipo.query.all()
    return jsonify([{
        'id': e.id,
        'nombre': e.nombre,
        'color_uniforme': e.color_uniforme,
        'jugadores_count': len(e.jugadores)
    } for e in equipos])


@app.route('/api/partidos')
def api_partidos():
    partidos = Partido.query.order_by(Partido.fecha_partido).all()
    return jsonify([{
        'id': p.id,
        'equipo_local': p.equipo_local.nombre,
        'equipo_visitante': p.equipo_visitante.nombre,
        'fecha': p.fecha_partido.strftime('%Y-%m-%d %H:%M'),
        'goles_local': p.goles_local,
        'goles_visitante': p.goles_visitante,
        'estado': p.estado,
        'fase': p.fase
    } for p in partidos])

# Función para crear el fixture automáticamente
@app.route('/admin/crear_fixture')
@login_required
def crear_fixture():
    equipos = Equipo.query.all()
    
    if len(equipos) < 2:
        flash('Se necesitan al menos 2 equipos para crear el fixture')
        return redirect(url_for('admin_partidos'))
    
    # Limpiar partidos existentes
    Partido.query.delete()
    
    # Crear partidos de grupos (todos contra todos)
    for i, equipo1 in enumerate(equipos):
        for j, equipo2 in enumerate(equipos[i+1:], i+1):
            fecha_base = datetime.now()
            fecha_partido = fecha_base.replace(hour=14, minute=0, second=0, microsecond=0)
            fecha_partido = fecha_partido.replace(day=fecha_partido.day + (i * len(equipos) + j))
            
            partido = Partido(
                equipo_local_id=equipo1.id,
                equipo_visitante_id=equipo2.id,
                fecha_partido=fecha_partido,
                fase='grupos'
            )
            db.session.add(partido)
    
    db.session.commit()
    flash('Fixture creado exitosamente')
    return redirect(url_for('admin_partidos'))
   


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        
        # Crear admin por defecto si no existe
        if not Admin.query.filter_by(username='admin').first():
            admin = Admin(
                username='admin',
                password_hash=generate_password_hash('admin123'),
                email='admin@juegosescolares.com'
            )
            db.session.add(admin)
            db.session.commit()
            print("Admin creado - Usuario: admin, Contraseña: admin123")
    
    app.run(debug=True) 