class Scheduler {
    constructor(cores) {
        this.listaListos = [];
        this.cores = cores; // Número de núcleos disponibles
        this.procesosActuales = []; // Array para manejar procesos en ejecución
        this.listaBloqueado = [];
        this.maxTime = 3000;
    }

    agregarProceso(proceso) {
        console.log(this.cores)
        proceso.estado = 'Listo';
        this.listaListos.push(proceso);
        console.log(`Proceso ${proceso.id} agregado a la lista de listos.`);
        changeLogM(proceso.id, proceso.time, proceso.dependencies, proceso.estado);
        this.programar();
    }

    async programar() {
        while (this.procesosActuales.length < this.cores && this.listaListos.length > 0) {
            const proceso = this.listaListos.shift();
            this.procesosActuales.push(proceso);
            console.log(`Proceso ${proceso.id} está ahora ejecutando.`);
            proceso.ejecutar(this.maxTime, this.procesosActuales)
                .then(() => this.terminarProceso(proceso))
                .catch((error) => this.bloquearProceso(proceso, error));
        }
    }

    bloquearProceso(proceso, error) {
        proceso.estado = 'Bloqueado';
        this.listaBloqueado.push(proceso);
        changeLogM(proceso.id, proceso.time, proceso.dependencies, proceso.estado);
        let cont = 0;
        if (error.message === "tiempo") {
            this.procesosActuales = this.procesosActuales.filter(p => p.id !== proceso.id);
            console.log(error.message+ " error de tiempo")
            setTimeout(()=>{
                proceso.time = 3000; // Restablecer el tiempo para volver a intentarlo
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
        console.log(`Proceso ${proceso.id} ha terminado y fue removido de los procesos actuales.`);
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

