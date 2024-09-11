class Scheduler {
    constructor(coresValue, timeValue) {
        this.listaListos = [];
        this.cores = coresValue; // Número de núcleos disponibles
        this.procesosActuales = []; // Array para manejar procesos en ejecución
        this.listaBloqueado = [];
        this.maxTime = timeValue;
        this.dependenciesResolved = [];
        this.checkInterval = {};
        this.procesoUsado = null;
    }

    agregarProceso(proceso, cont) {
            this.procesoUsado = proceso;
            proceso.estado = 'Listo';
            this.listaListos.push(proceso);
            changeLogM(proceso.id, proceso.time, proceso.dependencies, proceso.estado);



            if(cont===1){
                this.programar();
            }
    
    }

    async programar() {
        while (this.procesosActuales.length < this.cores && this.listaListos.length > 0) {
            const proceso = this.listaListos.shift();
            this.procesosActuales.push(proceso);
            proceso.ejecutar(this.maxTime, this.listaListos.length)
                .then(() => this.terminarProceso(proceso))
                .catch((error) => this.bloquearProceso(proceso, error));
        }
    }

    bloquearProceso(proceso, error) {
        if(error.message === "cancelado"){
            console.log("cancelado")
            return;
        }


        this.procesoUsado = proceso;
        this.programar();
        proceso.estado = 'Bloqueado';
        
        changeLogM(proceso.id, proceso.time, proceso.dependencies, proceso.estado);


        if (error.message === "tiempo") {
            this.listaBloqueado.push(proceso);
            this.procesosActuales = this.procesosActuales.filter(p => p.id !== proceso.id);
            console.log(error.message+ " error de tiempo")
            setTimeout(()=>{
                //if(this.listaListos.length > 0){
                    proceso.time -= this.maxTime; // Restablecer el tiempo para volver a intentarlo
                //}
                this.listaBloqueado = this.listaBloqueado.filter(p => p.id !== proceso.id);
                this.agregarProceso(proceso, 1);
            }, 1500)
        } else {
            this.listaBloqueado.push(proceso);
            console.log(error.message + " error de dependencia " + proceso.id);
            this.procesosActuales = this.procesosActuales.filter(p => p.id !== proceso.id);
            
            this.listaBloqueado.forEach(bloqueado => {
                this.checkInterval[bloqueado.id] = setInterval(() => {

                    if (this.listaBloqueado.length === 0) {
                        // Limpiar todos los intervalos si la lista está vacía
                        for (const id in this.checkInterval) {
                            if (this.checkInterval.hasOwnProperty(id)) {
                                clearInterval(this.checkInterval[id]);
                                delete this.checkInterval[id];
                            }
                        }
                        return; // Salir del intervalo actual
                    }
            
                    if (this.dependenciesResolved.includes(bloqueado.dependencies)) {
                        console.log(bloqueado.id);
                        clearInterval(this.checkInterval[bloqueado.id]);
                        delete this.checkInterval[bloqueado.id];
                        this.listaBloqueado = this.listaBloqueado.filter(p => p.id !== proceso.id);
                        proceso.dependencies = "";
                        this.agregarProceso(proceso, 1);
                    }
                }, 1000); // Chequea cada segundo
                
            });
            
        }
    }

    terminarProceso(proceso) {
        this.procesoUsado = proceso;


        const valorRandom = Math.floor(Math.random()*6);
        if( valorRandom === 5   ){
            changeLogM(proceso.id, proceso.time, proceso.dependencies, "Zombie");
        }else {
            changeLogM(proceso.id, proceso.time, proceso.dependencies, "Terminado");
            setTimeout(()=> {
                if(document.getElementById(proceso.id)){
                    document.getElementById(proceso.id).remove();
                }
            }, 1500)
        }
        

        this.procesosActuales = this.procesosActuales.filter(p => p.id !== proceso.id);
        this.dependenciesResolved.push(proceso.id)
        this.programar(); // Intenta ejecutar el siguiente proceso
    }


    killProcess(id, estado) {
        switch(estado) {
            case "Bloqueado":
                console.log("entro a kill Bloqueados afeura")
                if(this.checkInterval){
                    clearTimeout(this.checkInterval);
                }
                this.listaBloqueado = this.listaBloqueado.filter(p => p.id !== id);
                document.getElementById(id).remove();
                break;
            case "Ejecutando":
                console.log("ejecutando kill")
                this.procesosActuales = this.procesosActuales.filter(p => p.id !== id);
                document.getElementById(id).remove();
                this.procesoUsado.cancelar(true)

                break;
            case "Listo":
                console.log("listo")
                this.listaListos = this.listaListos.filter(p => p.id !== id);
                document.getElementById(id).remove();

                break;
            case "Nuevo":;
            console.log("nuevo")
                processes = processes.filter(p => p.id !== id)
                document.getElementById(id).remove();
                break;
            case "Zombie":
                document.getElementById(id).remove();
        }   
    }
}



function callCPU() {

    const callingProgramar = setInterval(() => {
        const hijosLog = document.querySelector(".log-father").childElementCount;
        if(hijosLog === 1){
            clearInterval(callingProgramar);
        }
        scheduler.programar();
    }, 500)
}


let scheduler;
const coresInput = document.getElementById('coresInput'),
timeInput = document.getElementById('timeInput');



coresInput.addEventListener("input", CallConfiguration);

timeInput.addEventListener("input", CallConfiguration);

function CallConfiguration(){
    scheduler = ConfigureScheduler(coresInput.value, timeInput.value*1000);
}


document.addEventListener("DOMContentLoaded", () => {
    CallConfiguration();
    // Aquí estableces la cantidad de núcleos
})

