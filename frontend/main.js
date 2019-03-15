document.addEventListener('DOMContentLoaded', function () {

    // Declarations
    ///////////////

    const baseApiUrl = 'http://localhost:3000';
    const getTaskFromAPIRest = () => {

        // GET to /tasks
        fetch(baseApiUrl + '/tasks')
            .then(response => response.json())
            .then(tasks => {
                appendTasks(tasks);
            })
            .catch(console.error)

    }

    const appendTasks = tasksArray => {
        let tasksSection = document.querySelector('main');

        tasksArray.forEach(task => {

            const taskNode = createTaskNode(task);
            tasksSection.appendChild(taskNode);

        })
    }

    const createTaskNode = taskObj => {

        // creat html string from value text
        let newTaskHtmlString = createTemplateHtmlString(taskObj)
        // console.log(newTaskHtmlString);

        // node creation from html string
        let taskNode = createNodeFromString(newTaskHtmlString)
        // console.log(taskNode)

        // add listeners
        addRemoveListener(taskNode);
        addCompleteListener(taskNode);

        return taskNode;

    }

    let createTemplateHtmlString = ({
            text,
            color,
            id,
            completed
        }) =>
        `<div class="task ${completed ? 'completed': ''}" data-id="${id}" style="border-color: ${color}">
            <div class="text">${text}</div>
            <button class="remove">remove</button>
            <button class="complete">complete</button>
        </div>`
    let createNodeFromString = string => {
        let divNode = document.createElement('div');
        divNode.innerHTML = string;
        return divNode.firstChild;
    }

    //!!!!!!!!!!!!!AQUI ESTÁ EL ACTIVADOR PARA QUITAR LA TAREA
    let addRemoveListener = node => {
        node.querySelector('.remove').addEventListener('click', event => {
            // event.target.parentNode.remove();

            //AQUI LLAMAMOS A LA FUNCION PARA QUE NOS MANDE AL BACK (index.js) LA ID DE LA TAREA EN LA
            //QUE LE HEMOS PULSADO A "REMOVE"
            //const TASK_ID = $(node).attr("data-id"); CON ESTO GUARDAMOS LA ID DE LA TAREA A QUITAR
            const TASK_ID = $(node).attr("data-id");
            node.remove();

            //LLAMAMOS A LA FUNCION PARA ELIMINAR LINEA 87***
            delete_tasks(TASK_ID);


        })
    }
    let addCompleteListener = node => {
        node.querySelector('.complete').addEventListener('click', event => {
            node.classList.toggle('completed')
        })
    }
    //FUNCION PARA ELIMINAR LA TAREA EN EL BACK ****
    function delete_tasks(task_id) {
        //ESTA ES LA SINTAXIS PARA ENVIAR LOS DATOS AL BACK (index.js) baseApiUrl es la direccion de 
        //nuestro back, + '/tasks' la ruta donde vamos a procesar nestro dato, el method es delete
        //por que vamos a realizar dicho procedimiento
        fetch(baseApiUrl + '/tasks', {
                method: 'delete',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    //aqui es donde ponemos nuestra variable con la id para mandarla al back
                    //Y DE AQUI ESTO SE ENVIA AL index.js linea 33
                    task_id
                })
            })
            .then(console.log)
            .then(response => response.json())
            .then(console.log)

            .catch(console.error)

    }


    //AQUI ENVIA AL BACKEND PARA GUARDAR LA TAREA
    let saveTaskToBackend = text => {
        // GET to /tasks
        return fetch(baseApiUrl + '/tasks', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text
                })
            })
            .then(console.log)
            .then(response => response.json())
            .then(console.log)

            .catch(console.error)
    }
    // // add tasks
    let inputNode = document.querySelector('header input');

    inputNode.addEventListener('keyup', function (event) {
        if (event.keyCode === 13) {
            //get value from input
            let newTaskText = event.target.value;


            saveTaskToBackend(newTaskText).then(() => {
                // creat html string from value text
                let newTaskHtmlString = createTemplateHtmlString({
                    text: newTaskText
                })
                // console.log(newTaskHtmlString);

                // node creation from html string
                let newTaskNode = createNodeFromString(newTaskHtmlString)
                // console.log(newTaskNode)

                // node inject to DOM in main
                document.querySelector('main').appendChild(newTaskNode)

                // clean value
                event.target.value = '';

                addRemoveListener(newTaskNode);
                addCompleteListener(newTaskNode);
            })


        }
    })

    // Encender la falla
    ////////////////////
    getTaskFromAPIRest();

})