function getCores(event) {
    if(event){
        console.log("no existe")
        return new Scheduler(event.target.value);
    }else {
        console.log("no existe")
        return new Scheduler(1)
    }
}


function validateCores(event, length) {
    const input = event.target;
    const value = input.value;

    if (value.length > length) {
        input.value = value.slice(0, 2);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('cores').addEventListener('input', (event) => validateCores(event, 2));
});



document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('time').addEventListener('input', (event) => validateCores(event, 10));
});




function changeLogM(id, time, dependencies, status) {
    const logClone = document.getElementById(id);
    if (logClone) {
        logClone.querySelector(`#id-label${id}`).textContent = id;
        logClone.querySelector(`#time-label${id}`).textContent = time;
        logClone.querySelector(`#dependencies-label${id}`).textContent = dependencies;
        logClone.querySelector(`#status-label${id}`).textContent = status;
        logClone.classList = `log clonado ${status}`
    } else {
        console.error(`No se encontró un elemento con el id ${id}`);
    }
}



function log(id, time, dependencies, status) {
    const logDiv = document.getElementById('log');
    const logClone = logDiv.cloneNode(true);
    logClone.classList.add("clonado")
    logClone.id = id
    logClone.style.display = "block"
    document.querySelector(".log-father").appendChild(logClone)
    logClone.querySelector("#id-label").id = `id-label${id}`;
    logClone.querySelector("#time-label").id = `time-label${id}`;
    logClone.querySelector("#dependencies-label").id = `dependencies-label${id}`;
    logClone.querySelector("#status-label").id = `status-label${id}`;
    changeLogM(id, time, dependencies, status)
}





let processes = []
const idE = document.getElementById('id');
const timeE = document.getElementById('time');
const dependenciesE = document.getElementById('dependencies');


const add = document.getElementById('addProcess');

add.addEventListener('click', function() {
    let input = document.getElementById("id")
    if(input.value != ""){
        console.log("el input" + input)
        const id = idE.value;
        const time = timeE.value;
        const dependencies = dependenciesE.value;
        console.log(dependencies)
        console.log(time)
        processes.push(new Proceso(id, time, dependencies, "nuevo"));

        log(id, time, dependencies, "nuevo");
        input.value = ""
        document.getElementById("time").value = "";
        document.getElementById("dependencies").value = "";
    }

});

document.getElementById('run').addEventListener('click', function() {
    processes.forEach(process => {
        console.log(process)
        scheduler.agregarProceso(process);
    });
    processes = []
});


document.getElementById('clear').addEventListener("click", () => {
    window.location.reload();
})


idE.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
        const inputValue = event.target.value; // Obtiene el valor ingresado en el campo
        const existingElement = document.getElementById(inputValue); // Busca si hay un elemento con ese id
    
        if (existingElement) {
            alert("El ID ya existe.");
            event.target.value = ""; // Opcional: Limpia el campo de entrada
        }else {
            add.click();
        }
    }
    
})
timeE.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
        add.click();

    }
})
dependenciesE.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
        add.click();
    }
})







