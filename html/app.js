const express = require('express');
const mysql = require('mysql2');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

// Crear una conexión pool
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'saludbienestar',
    password: process.env.DB_PASSWORD || 'securepassword',
    database: process.env.DB_NAME || 'saludbienestar',
});

// Initialize Express app
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => res.render('index'));

app.get('/register', (req, res) => {
    res.render('registro', { errors: null });
});

app.post('/register', (req, res) => {
    const { email, password, ofertas } = req.body;
  
    const recibirOfertas = 0;
  
    const query = 'INSERT INTO usuarios (email, password, recibe_ofertas) VALUES (?, ?, ?)';
    db.execute(query, [email, password, recibirOfertas], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error inserting data into the database');
      }
      res.send('¡Registro exitoso! Gracias por registrarte.');
    });
  });

  app.get('/productos/:categoria', (req, res) => {
    const { categoria } = req.params;
    let query = 'SELECT * FROM productos';
    if (categoria === 'frescos') query += " WHERE nombre LIKE '%fresco%'";
    if (categoria === 'ofertas') query += " WHERE oferta = 1";
    db.query(query, (err, results) => {
        if (err) throw err;
        res.render('productos', { productos: results, categoria });
    });
});

app.get('/contacto', (req, res) => {
    db.query('SELECT * FROM supermercados', (err, supermercados) => {
        if (err) {
            console.error('Error al obtener supermercados:', err);
            return res.status(500).send('Error al cargar la página de contacto');
        }
        res.render('contacto', { supermercados });
    });
});


app.post('/contacto', (req, res) => {
    const { name, email, supermercado, mensaje } = req.body;
    console.log(req.body)
    const query = 'INSERT INTO contacto (nombre, email, supermercado_id, mensaje) VALUES (?, ?, ?, ?)';
    const supermercadoId = supermercado || null; 1
    db.execute(query, [name, email, supermercadoId, mensaje], (err, results) => {
        if (err) {
            console.error(err);
            console.log('Valores enviados a la base de datos:', [name, email, supermercadoId, mensaje]);
            return res.status(500).send('Error al enviar el mensaje. Intenta nuevamente más tarde.');
        }
        res.send('¡Mensaje enviado con éxito! Gracias por tu opinión.');
    });
});


app.get('/directiva', (req, res) => {
    db.query('SELECT * FROM empleados', (err, results) => {
        if (err) throw err;
        res.render('directiva', { empleados: results });
    });
});

app.get('/ubicaciones', (req, res) => {
    db.query('SELECT * FROM supermercados', (err, resultsSupermercados) => {
        if (err) {
            console.error("Error al obtener supermercados: ", err);
            return res.status(500).send("Error al obtener supermercados");
        }

        db.query('SELECT * FROM sucursales', (err, resultsSucursales) => {
            if (err) {
                console.error("Error al obtener sucursales: ", err);
                return res.status(500).send("Error al obtener sucursales");
            }

            res.render('ubicaciones', {
                supermercados: resultsSupermercados,
                sucursales: resultsSucursales
            });
        });
    });
});

app.get('/recetas', (req, res) => {
    db.query('SELECT * FROM recetas', (err, results) => {
        if (err) throw err;
        res.render('recetas', { recetas: results });
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});
