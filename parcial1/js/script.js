function getCores(event) {
    if(event){
        return new Scheduler(event.target.value);
    }else {
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
    if(time === 0){
        time = 3000
    }
    if (logClone) {
        logClone.querySelector(`#id-label${id}`).textContent = " " + id;
        logClone.querySelector(`#time-label${id}`).textContent = " " + time/1000 + "s";
        logClone.querySelector(`#dependencies-label${id}`).textContent = " " + dependencies;
        logClone.querySelector(`#status-label${id}`).textContent = " " + status;
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





function add() {
    let input = document.getElementById("id")
    if(input.value != ""){
        const id = idE.value;
        const time = timeE.value * 1000;
        const dependencies = dependenciesE.value;

        processes.push(new Proceso(id, time, dependencies, "nuevo"));

        log(id, time, dependencies, "nuevo");
        input.value = ""
        document.getElementById("time").value = "";
        document.getElementById("dependencies").value = "";
    }

}



document.getElementById('run').addEventListener('click', function() {
    let cont = processes.length
    processes.forEach(process => {
        scheduler.agregarProceso(process, cont);
        cont--
        console.log("valor de cont= " +cont)
    });
    processes = []
});


document.getElementById('clear').addEventListener("click", () => {
    window.location.reload();
})



function verifyInput(event) {
    if (event.key === 'Enter' || event.type === "click") {
        const existingElement = document.getElementById(idE.value); // Busca si hay un elemento con ese id
        console.log(idE)
        console.log(existingElement)
        if(idE.value === ""){
            document.querySelector(".id").classList.add("error")
        }
        if (existingElement) {
            alert("El ID ya existe.");
            idE.value = ""; // Opcional: Limpia el campo de entrada
        }else {
            add();
        }
    }
}

idE.addEventListener("change", () => {
    document.querySelector(".id").classList.remove("error")
})


document.getElementById('addProcess').addEventListener('click', (event) => {
    verifyInput(event);
});;
idE.addEventListener("keydown", (event) => {
    verifyInput(event);
})
timeE.addEventListener("keydown", (event) => {
    verifyInput(event);
})
dependenciesE.addEventListener("keydown", (event) => {
    verifyInput(event);

})







