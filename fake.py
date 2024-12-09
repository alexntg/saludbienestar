import random
from faker import Faker
import mysql.connector

# Configuración de Faker en español
fake = Faker('es_ES')

# Configuración de la conexión a la base de datos
db_config = {
    'host': 'mariadb',
    'user': 'saludbienestar',
    'password': 'securepassword',
    'database': 'saludbienestar',
    'charset': 'utf8mb4',
    'collation': 'utf8mb4_general_ci'
}

# Lista de cargos limitados para empleados de supermercado y directivos
cargos_supermercado = [
    "Cajero/a", 
    "Reponedor/a", 
    "Supervisor/a", 
    "Gerente de tienda"
]

cargos_directivos = [
    "Director General", 
    "Director de Finanzas", 
    "Director de Marketing", 
    "Director de Recursos Humanos"
]

# Generadores de datos
def generar_empleados(n):
    return [
        (
            fake.name()[:100],
            fake.email()[:100],
            fake.phone_number()[:15],
            random.choice(cargos_supermercado + cargos_directivos)[:50]  # Limitar a 50 caracteres
        )
        for _ in range(n)
    ]

def generar_supermercados(n):
    return [
        (f"Supermercado {fake.city()[:100]}", fake.address()[:255])
        for _ in range(n)
    ]

def generar_sucursales(n):
    return [
        (f"Sucursal {fake.city()[:100]}", fake.street_address()[:255])
        for _ in range(n)
    ]

def generar_productos(n):
    return [
        (
            fake.word().capitalize()[:100],
            round(random.uniform(1, 100), 2),
            random.choice([None, round(random.uniform(1, 50), 2)])
        )
        for _ in range(n)
    ]

def generar_recetas(n):
    return [
        (fake.sentence()[:100], fake.text(max_nb_chars=200)[:1000], ', '.join(fake.words(nb=5))[:100])
        for _ in range(n)
    ]

def generar_formulario(n):
    return [
        (fake.name()[:100], fake.email()[:100], fake.phone_number()[:15], fake.text()[:1000])
        for _ in range(n)
    ]

# Insertar datos en la base de datos
def insertar_datos():
    conexion = None
    cursor = None
    try:
        # Conectar a la base de datos
        conexion = mysql.connector.connect(**db_config)
        cursor = conexion.cursor()

        # Generar e insertar empleados
        empleados = generar_empleados(210)
        cursor.executemany("INSERT INTO empleados (nombre, email, telefono, cargo) VALUES (%s, %s, %s, %s)", empleados)

        # Generar e insertar supermercados
        supermercados = generar_supermercados(10)
        cursor.executemany("INSERT INTO supermercados (nombre, ubicacion) VALUES (%s, %s)", supermercados)

        # Generar e insertar sucursales
        sucursales = generar_sucursales(3)
        cursor.executemany("INSERT INTO sucursales (nombre, ubicacion) VALUES (%s, %s)", sucursales)

        # Generar e insertar productos
        productos = generar_productos(300)
        cursor.executemany("INSERT INTO productos (nombre, precio, oferta) VALUES (%s, %s, %s)", productos)

        # Generar e insertar recetas
        recetas = generar_recetas(10)
        cursor.executemany("INSERT INTO recetas (nombre, pasos, ingredientes) VALUES (%s, %s, %s)", recetas)

        # Generar e insertar formularios
        formularios = generar_formulario(20)
        cursor.executemany("INSERT INTO formulario (nombre, email, telefono, peticion) VALUES (%s, %s, %s, %s)", formularios)

        # Confirmar los cambios
        conexion.commit()
        print("Datos insertados correctamente en la base de datos.")

    except mysql.connector.Error as err:
        print(f"Error: {err}")
    finally:
        # Cerrar recursos si fueron inicializados
        if cursor:
            cursor.close()
        if conexion:
            conexion.close()

# Ejecutar el script
if __name__ == "__main__":
    insertar_datos()
