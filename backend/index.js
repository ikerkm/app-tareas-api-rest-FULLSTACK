const express = require('express');
const app = express();

const fs = require('fs');

const port = Number(process.argv[2]) || 3000;


// BODY PARSE TO JSON
app.use(express.json());


// enable CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.get('/tasks', (req, res) => {

    const stringJson = fs.readFileSync('./bd.json', 'UTF-8');

    const data = JSON.parse(stringJson);
    res.status(200).json(data.tasks);

});

//!!!!!!!!!!!!!!!!!!!!!!NOTA PARA QUE A MI ME FUNCIONARA HE TENIDO QUE PONER ESTO DENTRO DEL app.use 
//DE LA LINEA 14 res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
//!!!!!!!!!!!!!!!!!!!!!AQUI LLAMAMOS AL METODO DELETE PARA REALIZAR LA ELIMINACIÓN DE LA TAREA
app.delete('/tasks', function (req, res) {
    //EL req ES EL DATO QUE MANDAMOS DESDE main.js (FUNCION LINEA 88)
    //COMPROBAMOS QUE LA ID QUE HEMOS MANDADO DE main.js (variable task_id) es de tipo string
    if (typeof req.body.task_id === "string") {
        try {

            // COGER EL ARCHIVO DONDE ESTAN LAS TAREAS GUARDADAS
            const stringJson = fs.readFileSync('./bd.json', 'UTF-8');

            const data = JSON.parse(stringJson);

            //AQUI RECORREMOS EL ARRAY OBTENIDO DEL ARCHIVO CON LAS TAREAS Y COMPARAMOS LA ID QUE HEMOS OBTENIDO
            //CON LAS ID DE LOS ITEMS DEL ARRAY, EN EL IF COMPROBAMOS SI LA ID COINCIDE Y SI ES ASI
            //ELIMINAMOS EL CONTENIDO DE ESA POSICION DEL ARRAY.
            for (let i = 0; i < data.tasks.length; i++) {
                if (data.tasks[i].id === parseInt(req.body.task_id)) {

                    delete data.tasks[i];

                }

            }
            //AL ELIMINAR EL CONTENIDO DEL ARRAY SE NOS QUEDARA COMO NULL EN EL HUECO, POR LO TANTO LO VAMOS A FILTRAR
            //PARA QUE SI ENCUENTRA UN NULL EN ALGUNA DE LAS POSICIONES DEL ARRAY, LO BORRE
            const DATA_FILTERED = data.tasks.filter(remove_empty)

            function remove_empty(data) {
                return data !== null;
            }
            //AQUI SUSTITUIMOS EL ARAY "FILTRADO" POR EL ORIGINAL
            data.tasks = DATA_FILTERED;
            console.log("after:" + data);

            //Y CON ESTO GUARDAMOS LOS DATOS MODIFICADOS
            const newDataString = JSON.stringify(data);
            fs.writeFileSync('./bd.json', newDataString);

            // response to front
            res.json({
                code: 200
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({
                message: 'something went wrong. my fault. sorry'
            })

        }
    } else {
        res.status(400).json({
            message: 'NO TEXT? REALLY? THINK TWICE'
        })
    }




});

app.post('/tasks', (req, res) => {
    if (req.body.text) {
        try {
            let task = {
                text: req.body.text,
                completed: false,
                id: Date.now(),
                color: null
            }
            // get a parse file
            const stringJson = fs.readFileSync('./bd.json', 'UTF-8');

            const data = JSON.parse(stringJson);
            // add tasks
            data.tasks.push(task);

            //save to file
            const newDataString = JSON.stringify(data);
            fs.writeFileSync('./bd.json', newDataString);

            // response to front
            res.json({
                code: 200
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({
                message: 'something went wrong. my fault. sorry'
            })

        }
    } else {
        res.status(400).json({
            message: 'NO TEXT? REALLY? THINK TWICE'
        })
    }

});

app.listen(port, () => console.log('Servidor levantado en ' + port));