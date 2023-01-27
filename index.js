require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const DB_URI = process.env.DB_URI || "mongodb://127.0.0.1:27017/tienda";
const PORT = process.env.PORT || 3000;

mongoose.set('strictQuery', true);
mongoose.connect(DB_URI)
    .then(db => console.log('Conexión satisfactoria con la base de datos'))
    .catch(error => console.log('No se ha podido establecer la conexión con la base de datos', error));

app.use(express.static('public'));
app.use(express.json());

const Articulo = mongoose.model('Articulo', new mongoose.Schema(
    {
        nombre: {type: String, default: "Sin nombre"},
        precio: {type: Number, default: 0}
    }
) );

app.get("/api/articulos", cors(), (req, res) => {
    Articulo.find(
        {},
        (error, data) => {
            if (error) res.json(error);
            else res.json(data);
        } 
    );
});

app.post("/api/articulos", cors(), (req, res) => {
    new Articulo({nombre: req.body.nombre, precio: req.body.precio})
        .save((error, data) => {
            if (error) res.json(error);
            else res.json(data);
        })
});

app.delete("/api/articulos/:id", cors(),(req, res) => {
    Articulo.findOneAndDelete(
        {_id: req.params.id},
        (error, data) => {
            if (error) res.json(error);
            else res.json(data);
        })
});

app.put("/api/articulos/:id", cors(), (req, res) => {
    Articulo.findOneAndUpdate(
        {_id: req.params.id},
        {$set: {nombre: req.body.nombre, precio: req.body.precio}},
        (error, data) => {
            if (error) res.json(error);
            else res.json(data);
        })
});


app.listen(PORT, () => {console.log("Iniciado servidor web")});





//---------------------------------------------------
// const articulos = [
//     {nombre: "Camisa", precio: 22},
//     {nombre: "Botas", precio: 160}
// ];



// app.get("/api/articulos", (request, response) => {
//     response.json(articulos);
// });

// app.post("/api/articulos", (request, response) => {
//     articulos.push({
//         nombre: request.body.nombre, 
//         precio: request.body.precio
//     });
//     response.json(articulos);
// });

// app.delete("/api/articulos/:id", (request, response) => {
//     // articulos = articulos.filter((value, index) => index != request.params.id);
//     articulos.splice(request.params.id, 1);
//     response.json(articulos);
// });

// app.put("/api/articulos/:id", (request, response) => {
//     articulos[request.params.id] = request.body;
//     response.json(articulos);
// });
