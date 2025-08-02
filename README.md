# 🏆 Juegos Escolares - Sistema de Gestión de Torneos

Un sistema web completo para gestionar torneos escolares con equipos, jugadores y fixture automático.

## ✨ Características Principales

- **Gestión de Equipos**: Registra hasta 14 equipos con líderes y números telefónicos
- **Registro de Jugadores**: Sistema de jugadores con DNI único y posiciones
- **Fixture Automático**: Genera automáticamente el fixture con eliminación directa
- **Panel de Administración**: Interfaz completa para administradores
- **Vista Pública**: Páginas públicas para que los jugadores vean resultados
- **Diseño Responsivo**: Interfaz moderna y adaptable a todos los dispositivos

## 🚀 Instalación

### Requisitos Previos

- Python 3.8 o superior
- pip (gestor de paquetes de Python)

### Pasos de Instalación

1. **Clona o descarga el proyecto**
   ```bash
   # Si tienes git instalado
   git clone <url-del-repositorio>
   cd juegos-escolares
   ```

2. **Instala las dependencias**
   ```bash
   pip install -r requirements.txt
   ```

3. **Ejecuta la aplicación**
   ```bash
   python app.py
   ```

4. **Abre tu navegador**
   - Ve a: `http://localhost:5000`
   - Credenciales de administrador por defecto:
     - Usuario: `admin`
     - Contraseña: `admin123`

## 📋 Estructura del Proyecto

```
juegos-escolares/
├── app.py                 # Aplicación principal Flask
├── requirements.txt       # Dependencias de Python
├── README.md             # Este archivo
├── templates/            # Plantillas HTML
│   ├── base.html         # Plantilla base
│   ├── index.html        # Página de inicio
│   ├── login.html        # Página de login
│   ├── fixture.html      # Vista del fixture
│   ├── equipos.html      # Vista de equipos
│   ├── ver_equipo_publico.html
│   └── admin/            # Plantillas de administración
│       ├── dashboard.html
│       ├── equipos.html
│       ├── jugadores.html
│       ├── nuevo_equipo.html
│       └── nuevo_jugador.html
├── static/               # Archivos estáticos
│   ├── css/
│   │   └── style.css     # Estilos personalizados
│   └── js/
│       └── main.js       # JavaScript principal
└── juegos_escolares.db   # Base de datos SQLite (se crea automáticamente)
```

## 🎯 Funcionalidades

### Para Administradores

1. **Dashboard Principal**
   - Estadísticas en tiempo real
   - Acciones rápidas
   - Progreso hacia el objetivo de 14 equipos

2. **Gestión de Equipos**
   - Crear nuevos equipos
   - Asignar colores de uniforme
   - Ver lista completa de equipos
   - Estadísticas por equipo

3. **Gestión de Jugadores**
   - Registrar jugadores con DNI único
   - Asignar números telefónicos
   - Definir posiciones (Portero, Defensa, etc.)
   - Designar líderes de equipo

4. **Gestión de Partidos**
   - Crear fixture automático
   - Programar partidos manualmente
   - Actualizar resultados
   - Ver estadísticas de partidos

### Para Jugadores y Público

1. **Vista de Equipos**
   - Lista de todos los equipos participantes
   - Información de líderes y contactos
   - Estadísticas del torneo

2. **Fixture Público**
   - Ver todos los partidos programados
   - Filtrar por fase o equipo
   - Ver resultados en tiempo real
   - Próximos partidos destacados

3. **Detalles de Equipo**
   - Información completa del equipo
   - Lista de jugadores
   - Contacto del líder

## 🔧 Configuración

### Variables de Entorno (Opcional)

Crea un archivo `.env` en la raíz del proyecto:

```env
SECRET_KEY=tu_clave_secreta_muy_segura
DATABASE_URL=sqlite:///juegos_escolares.db
FLASK_ENV=development
```

### Personalización

- **Colores**: Modifica `static/css/style.css` para cambiar el esquema de colores
- **Logo**: Reemplaza los iconos de Font Awesome en las plantillas
- **Configuración de Base de Datos**: Modifica `app.py` para usar otros sistemas de base de datos

## 📱 Uso del Sistema

### Primeros Pasos

1. **Inicia sesión como administrador**
   - Usuario: `admin`
   - Contraseña: `admin123`

2. **Crea los primeros equipos**
   - Ve a "Gestionar Equipos"
   - Haz clic en "Nuevo Equipo"
   - Completa la información básica

3. **Registra jugadores**
   - Ve a "Gestionar Jugadores"
   - Haz clic en "Nuevo Jugador"
   - Asigna DNI único y equipo
   - Designa líderes con números telefónicos

4. **Genera el fixture**
   - Ve a "Gestionar Partidos"
   - Haz clic en "Crear Fixture Automático"
   - El sistema generará todos los partidos

### Flujo de Trabajo Típico

1. **Registro de Equipos** → 2. **Registro de Jugadores** → 3. **Crear Fixture** → 4. **Actualizar Resultados** → 5. **Final del Torneo**

## 🛠️ Mantenimiento

### Respaldos

La base de datos se guarda en `juegos_escolares.db`. Para hacer respaldos:

```bash
# Respaldar base de datos
cp juegos_escolares.db backup_$(date +%Y%m%d).db
```

### Actualizaciones

Para actualizar el sistema:

1. Respaldar la base de datos actual
2. Descargar la nueva versión
3. Instalar nuevas dependencias: `pip install -r requirements.txt`
4. Ejecutar la aplicación

## 🔒 Seguridad

- **Autenticación**: Sistema de login para administradores
- **Validación**: Verificación de DNI único para jugadores
- **Sesiones**: Gestión segura de sesiones de usuario
- **Contraseñas**: Hash seguro de contraseñas

## 📊 Base de Datos

El sistema utiliza SQLite con las siguientes tablas:

- **Admin**: Administradores del sistema
- **Equipo**: Información de equipos
- **Jugador**: Datos de jugadores
- **Partido**: Información de partidos y resultados

## 🎨 Tecnologías Utilizadas

- **Backend**: Python Flask
- **Base de Datos**: SQLite con SQLAlchemy
- **Frontend**: HTML5, CSS3, JavaScript
- **Framework CSS**: Bootstrap 5
- **Iconos**: Font Awesome
- **Autenticación**: Flask-Login

## 🤝 Contribuciones

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature
3. Realiza tus cambios
4. Envía un pull request

## 📞 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación
2. Verifica que todas las dependencias estén instaladas
3. Comprueba que Python 3.8+ esté instalado
4. Revisa los logs de error en la consola

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo LICENSE para más detalles.

## 🎯 Roadmap

- [ ] Sistema de notificaciones por email
- [ ] App móvil para jugadores
- [ ] Estadísticas avanzadas
- [ ] Sistema de grupos automático
- [ ] Exportación a PDF
- [ ] Integración con redes sociales

---

**¡Disfruta gestionando tu torneo escolar! 🏆⚽** 