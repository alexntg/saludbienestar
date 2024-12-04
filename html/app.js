const express = require('express');
const mysql = require('mysql2');
const app = express();

// Configuración de la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootpassword',
    database: 'salud_bienestar',
});

// Configurar EJS
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Rutas
app.get('/', (req, res) => res.render('index'));

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

      console.log("Supermercados:", resultsSupermercados); // Verifica si se están recuperando correctamente los supermercados

      db.query('SELECT * FROM sucursales', (err, resultsSucursales) => {
          if (err) {
              console.error("Error al obtener sucursales: ", err);
              return res.status(500).send("Error al obtener sucursales");
          }

          console.log("Sucursales:", resultsSucursales); // Verifica si se están recuperando correctamente las sucursales

          res.render('ubicaciones', {
              supermercados: resultsSupermercados, // Asegúrate de pasar los resultados correctamente
              sucursales: resultsSucursales        // Asegúrate de pasar los resultados correctamente
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

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
