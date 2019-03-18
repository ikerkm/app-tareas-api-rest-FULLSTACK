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
        addUpdateListener(taskNode);
        return taskNode;

    }

    let createTemplateHtmlString = ({
            text,
            color,
            id,
            completed
        }) =>
        `<div class="task ${completed ? 'completed': ''}" data-id="${id}" style="background-color: ${color}">
        <input type="color" class='select_color' name="favcolor" value="${color}">
           
            <input type="text" value="${text}" style="background-color: ${color}" class="edit_text"/>
            <button class="remove">remove</button>
            <button class="complete">complete</button>
            <button class="update">Update</button>
        </div>`
    let createNodeFromString = string => {
        let divNode = document.createElement('div');
        divNode.innerHTML = string;
        return divNode.firstChild;
    }


    let addRemoveListener = node => {
        node.querySelector('.remove').addEventListener('click', event => {


            const TASK_ID = $(node).attr("data-id");
            node.remove();


            delete_tasks(TASK_ID);


        })
    }


    let addUpdateListener = node => {
        node.querySelector('.update').addEventListener('click', event => {


            let the_color = $(node).find('.select_color').val();
            let the_text = $(node).find('.edit_text').val();
            const TASK_ID = $(node).attr("data-id");

            let data_to_update = {
                the_color,
                the_text,
                TASK_ID
            };
            console.log(data_to_update);
            update_data(data_to_update);


        })
    }


    function update_data(data_update) {
        fetch(baseApiUrl + '/tasks', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({

                    data_update
                })
            })
            .then(location.reload())


            .catch(console.error)


    }

    function delete_tasks(task_id) {

        fetch(baseApiUrl + '/tasks', {
                method: 'delete',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({

                    task_id
                })
            })
            .then(console.log)
            .then(response => response.json())
            .then(console.log)

            .catch(console.error)

    }

    let addCompleteListener = node => {
        node.querySelector('.complete').addEventListener('click', event => {
            node.classList.toggle('completed')


            const TASK_ID = $(node).attr("data-id");

            update_data(TASK_ID);

        })
    }

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
                addCompleteListener(newTaskNode);
                addRemoveListener(newTaskNode);
                addUpdateListener(newTaskNode);
            })


        }
    })

    // Encender la falla
    ////////////////////
    getTaskFromAPIRest();

})