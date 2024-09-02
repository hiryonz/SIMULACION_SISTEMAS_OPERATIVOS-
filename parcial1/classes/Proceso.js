class Proceso {
    constructor(id, time, dependencies, estado) {
        this.id = id;
        this.time = time;
        this.dependencies = dependencies;
        this.estado = estado; // Nuevo, Listo, Ejecutando, Bloqueado, Terminado
    }

    async ejecutar(maxTime) {
        this.estado = 'Ejecutando';
        console.log(`Proceso ${this.id} está ejecutando.`);
        changeLogM(this.id, this.time, this.dependencies, this.estado);

        // Simula el tiempo que el proceso está en ejecución    
        return new Promise((resolve, reject) => {
            if (this.dependencies) {
                reject(new Error("dependencia"));

                return;
            }
            console.log(this.time)
            if (this.time > 3000) {
                setTimeout(() => {
                    reject(new Error("tiempo"));
                }, maxTime);
                return;
            }

            setTimeout(resolve, maxTime);
        }).then(() => {
            this.estado = 'Terminado';
            console.log(`Proceso ${this.id} ha terminado.`);
            changeLogM(this.id, this.time, this.dependencies, this.estado);
        });
    }
}