class Scheduler {
    constructor(cores) {
        this.listaListos = [];
        this.cores = cores; // Número de núcleos disponibles
        this.procesosActuales = []; // Array para manejar procesos en ejecución
        this.listaBloqueado = [];
        this.maxTime = 3000;
    }

    agregarProceso(proceso, cont) {
            proceso.estado = 'Listo';
            this.listaListos.push(proceso);
            changeLogM(proceso.id, proceso.time, proceso.dependencies, proceso.estado);
            if(cont===1){
                this.programar();
            }
    
    }

    async programar() {
        console.log(this.listaListos)
        while (this.procesosActuales.length < this.cores && this.listaListos.length > 0) {
            console.log(this.listaListos.length)
            const proceso = this.listaListos.shift();
            this.procesosActuales.push(proceso);
            console.log(proceso)
            console.log(this.maxTime)
            console.log(this.listaListos.length)
            proceso.ejecutar(this.maxTime, this.listaListos.length)
                .then(() => this.terminarProceso(proceso))
                .catch((error) => this.bloquearProceso(proceso, error));
        }
    }

    bloquearProceso(proceso, error) {
        this.programar();
        proceso.estado = 'Bloqueado';
        this.listaBloqueado.push(proceso);
        changeLogM(proceso.id, proceso.time, proceso.dependencies, proceso.estado);
        let cont = 0;
        if (error.message === "tiempo") {
            this.procesosActuales = this.procesosActuales.filter(p => p.id !== proceso.id);
            console.log(error.message+ " error de tiempo")
            setTimeout(()=>{
                if(this.listaListos.length > 0){
                    proceso.time -= this.maxTime; // Restablecer el tiempo para volver a intentarlo
                }
                this.listaBloqueado = this.listaBloqueado.filter(p => p.id !== proceso.id);
                this.agregarProceso(proceso);
            }, 1500)
        } else {
            console.log(error.message+ " error de dependencia")
            this.procesosActuales = this.procesosActuales.filter(p => p.id !== proceso.id);

            const checkInterval = setInterval(() => {
                const statusLabel = document.getElementById(`status-label${proceso.dependencies}`);  
                cont++;
                if(cont === 10) {
                    clearInterval(checkInterval);
                    this.listaBloqueado = this.listaBloqueado.filter(p => p.id !== proceso.id);
                    this.listaBloqueado.shift();
                    changeLogM(proceso.id, proceso.time, proceso.dependencies, "Error");
                }
                this.procesosActuales = this.procesosActuales.filter(p => p.id !== proceso.id);
                if (statusLabel && statusLabel.innerText === "Terminado") {
                    clearInterval(checkInterval);
                    proceso.dependencies = null
                    this.listaBloqueado = this.listaBloqueado.filter(p => p.id !== proceso.id);
                    
                    this.agregarProceso(proceso);
                }
            }, 1000); // Chequea cada segundo
        }
    }

    terminarProceso(proceso) {
        this.procesosActuales = this.procesosActuales.filter(p => p.id !== proceso.id);
        setTimeout(()=> {
            document.getElementById(proceso.id).remove();
        }, 1500)
        this.programar(); // Intenta ejecutar el siguiente proceso
    }
}

let scheduler;
document.getElementById('cores').addEventListener("input", (event) => {
    scheduler = getCores(event);
    // Aquí estableces la cantidad de núcleos
})
document.addEventListener("DOMContentLoaded", () => {
    scheduler = new Scheduler(1)
    // Aquí estableces la cantidad de núcleos
})

