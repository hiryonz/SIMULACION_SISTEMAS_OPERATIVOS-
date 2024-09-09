class Proceso {
    constructor(id, time, dependencies, estado) {
        this.id = id;
        this.time = time;
        this.dependencies = dependencies;
        this.estado = estado; // Nuevo, Listo, Ejecutando, Bloqueado, Terminado
    }

    async ejecutar(maxTime, procesoListo) {
        let tiempoFinal;

        this.estado = 'Ejecutando';
        changeLogM(this.id, this.time, this.dependencies, this.estado);

        return new Promise((resolve, reject) => {
            if (this.dependencies) {
                reject(new Error("dependencia"));
                
                return;
            }
            // Simula el tiempo que el proceso está en ejecución   
            console.log(maxTime)
            console.log("tiempo:"+this.time)

            if(this.time < maxTime && this.time != 0){
                tiempoFinal = this.time;
            }else{
                tiempoFinal = maxTime;
            }

            if (this.time > maxTime && procesoListo != 0) {
                console.log("entro al reject")
                setTimeout(() => {
                    reject(new Error("tiempo"));
                }, maxTime - 1000);
                return;
            }
            if (this.time > maxTime && procesoListo == 0) {
                tiempoFinal = this.time;
            }


            setTimeout(resolve, tiempoFinal);
        }).then(() => {
            this.estado = 'Terminado';
            changeLogM(this.id, this.time, this.dependencies, this.estado);
        });
    }
}