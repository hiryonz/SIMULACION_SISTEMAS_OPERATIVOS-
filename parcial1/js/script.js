function ConfigureScheduler(coresValue, timeValue) {
    if(coresValue && timeValue){
        return new Scheduler(coresValue, timeValue );
    }else {
        return new Scheduler(1)
    }
}


        function validateNumber(event, length) {
            const input = event.target;
            let value = input.value;

            // Remover caracteres no numéricos (solo dígitos y signos)
            value = value.replace(/[^0-9]/g, '');

            // Limitar la longitud del valor
            if (value.length > length) {
                value = value.slice(0, length);
            }


            // Asegurarse de que el valor no sea negativo
            input.value = Math.max(0, value);
        }

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('coresInput').addEventListener('input', (event) => validateNumber(event, 2));
    document.getElementById('coresInput').addEventListener('blur', (event) => {
        let input = event.target;
        if(input.value == 0){
            input.value = 1
        }
    }); 
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('timeInput').addEventListener('input', (event) => validateNumber(event, 2));
    document.getElementById('timeInput').addEventListener('blur', (event) => {
        let input = event.target;
        if(input.value == 0){
            input.value = 1
        }
    });
});



document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('time').addEventListener('input', (event) => validateNumber(event, 10));
});




function changeLogM(id, time, dependencies, status) {
    const logClone = document.getElementById(id);

    if (logClone) {
        logClone.querySelector(`#id-label${id}`).textContent = " " + id;
        logClone.querySelector(`#time-label${id}`).textContent = " " + time/1000 + "s";
        logClone.querySelector(`#dependencies-label${id}`).textContent = " " + dependencies;
        logClone.querySelector(`#status-label${id}`).textContent = " " + status;
        logClone.classList = `log clonado ${status}`
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
    let deleteBtn = logClone.querySelector(".delete-btn")
    deleteBtn.id = `delete-id${id}`

    changeLogM(id, time, dependencies, status)
    createDelete(deleteBtn);
}


function createDelete(deleteBtn){
    
        const regex = /\d+$/;
        deleteBtn.addEventListener("click", () => {
            const newId = deleteBtn.id.match(regex);
            const status = document.getElementById(`status-label${newId[0]}`).innerText;
            console.log(status)
            console.log(newId[0])
            console.log(processes)
            scheduler.killProcess(newId[0], status);

        })

}


let processes = []
const idE = document.getElementById('id');
const timeE = document.getElementById('time');
const dependenciesE = document.getElementById('dependencies');


const 
word = document.getElementById("word"),
excel = document.getElementById("excel"),
chromes = document.getElementById("chrome"),
clickear = document.getElementById("clickear");

word.addEventListener("click", function() {
    Verificacion();
 
     if(!this.classList.contains("active")){
         Add("3214", 1000, "");
         Add("3215", 5000, "");
         Add("3216", 3000, "3217");
         Add("3217", 11000, "");
         Add("3218", 7000, "");
         Add("3219", 2000, "");
         Add("3220", 3000, "3219");
         Add("3221", 3000, "3220");
         Add("3222", 3000, "");
         Add("3223", 3000, "");
     }
     
     this.classList.add("active")
 });

excel.addEventListener("click", function() {
    Verificacion();

    if(!this.classList.contains("active")){
        Add("2214", 1000, "");
        Add("2215", 15000, "2223");
        Add("2216", 2000, "");
        Add("2217", 10000, "");
        Add("2218", 5000, "2223");
        Add("2219", 2000, "");
        Add("2220", 3000, "2219");
        Add("2221", 3000, "2216");
        Add("2222", 1000, "");
        Add("2223", 500, "");
    }
    
    this.classList.add("active")
});

chromes.addEventListener("click", function() {
    Verificacion();

    if(!this.classList.contains("active")){
        Add("4214", 10000, "4223");
        Add("4215", 5000, "");
        Add("4216", 3000, "4215");
        Add("4217", 6000, "");
        Add("4218", 4000, "");
        Add("4219", 2000, "");
        Add("4220", 2000, "4214");
        Add("4221", 3000, "4223");
        Add("4222", 23000, "");
        Add("4223", 3000, "");
    }
    
    this.classList.add("active")
});

clickear.addEventListener("click", function() {
    Verificacion();

    if(!this.classList.contains("active")){
        Add("5214", 2000, "");
        Add("5215", 5000, "5214");
        Add("5216", 3000, "5217");
        Add("5217", 3500, "");
        Add("5218", 7000, "");
        Add("5219", 2000, "");
        Add("5220", 3000, "5217");
        Add("5221", 9000, "");
        Add("5222", 5000, "5223");
        Add("5223", 2000, "");
    }
    
    this.classList.add("active")
});



function Verificacion() {
    const hijosLog = document.querySelector(".log-father").childElementCount;
    if(hijosLog === 1){
        word.classList.remove("active");
        excel.classList.remove("active");
        chromes.classList.remove("active");
        clickear.classList.remove("active");
    }
}

function CollectData() {
    let input = document.getElementById("id")
    if(input.value != ""){
        const id = idE.value;
        let time = timeE.value * 1000;
        const dependencies = dependenciesE.value;

        if(time === 0){
            time = document.getElementById('timeInput').value * 1000
        }


        Add(id, time, dependencies);

        input.value = "";
        document.getElementById("time").value = "";
        document.getElementById("dependencies").value = "";
    }
}

function Add(id, time, dependencies) {

        processes.push(new Proceso(id, time, dependencies, "Nuevo"));
        log(id, time, dependencies, "Nuevo");
        console.log(processes)
}

function Run() {
    let cont = processes.length
    callCPU()

    processes.forEach(process => {
        scheduler.agregarProceso(process, cont);
        cont--
        console.log("valor de cont= " +cont)
    });
    processes = []
}

document.getElementById('run').addEventListener('click', Run);
document.getElementById('run2').addEventListener('click', Run);



document.getElementById('clear').addEventListener("click", () => {
    window.location.reload();
})
document.getElementById('clear2').addEventListener("click", () => {
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
            CollectData();
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

const pruebaBtn =  document.querySelector(".toggle");


pruebaBtn.addEventListener("click", ToogleMenu);

function ToogleMenu() {
    document.querySelector(".contenedor").classList.toggle("active")
    if(pruebaBtn.textContent === "Pruebas"){
        pruebaBtn.textContent = "Procesos Manuales"
    }else {
        pruebaBtn.textContent = "Pruebas"

    }
}












