class Proceso {
    constructor(id, time, dependencies, estado) {
        this.id = id;
        this.time = time;
        this.dependencies = dependencies;
        this.estado = estado; // Nuevo, Listo, Ejecutando, Bloqueado, Terminado
    }

    async ejecutar(maxTime, procesoListo) {
        this.estado = 'Ejecutando';
        changeLogM(this.id, this.time, this.dependencies, this.estado);

        return new Promise((resolve, reject) => {
            if (this.dependencies) {
                reject(new Error("dependencia"));
                
                return;
            }
            // Simula el tiempo que el proceso está en ejecución   
            console.log(this.time)
            console.log(procesoListo) 
            if (this.time > 3000 && procesoListo != 0) {
                console.log("entro al reject")
                setTimeout(() => {
                    reject(new Error("tiempo"));
                }, 2700);
                return;
            }
            if (this.time > 3000 && procesoListo == 0) {
                maxTime = this.time;
            }


            setTimeout(resolve, maxTime);
        }).then(() => {
            this.estado = 'Terminado';
            changeLogM(this.id, this.time, this.dependencies, this.estado);
        });
    }
}