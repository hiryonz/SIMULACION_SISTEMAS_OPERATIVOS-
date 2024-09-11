class Proceso {
    constructor(id, time, dependencies, estado) {
        this.id = id;
        this.time = time;
        this.dependencies = dependencies;
        this.estado = estado; // Nuevo, Listo, Ejecutando, Bloqueado, Terminado
        this.cancelado = false;
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


            if(this.time < maxTime && this.time != 0){
                tiempoFinal = this.time;
            }else{
                tiempoFinal = maxTime;
            }

            if (this.time > maxTime && procesoListo != 0) {
                setTimeout(() => {
                    reject(new Error("tiempo"));
                }, maxTime - 1000);
                return;
            }
            if (this.time > maxTime && procesoListo == 0) {
                tiempoFinal = this.time;
            }

            //para borrar la cancelacion
            const cancelarIntervalo = setInterval(()=>{
                if (this.cancelado) {
                    clearInterval(cancelarIntervalo);
                    reject(new Error("cancelado"));
                    return;
                }
            },500)

            setTimeout(() => {
                if (!this.cancelado) {
                    clearInterval(cancelarIntervalo);
                    resolve();
                }
            }, tiempoFinal);


            

            //setTimeout(resolve, tiempoFinal);
        })
    }


    cancelar(valorCancelado) {
        this.cancelado = valorCancelado;  // Establece la bandera de cancelación
    }
}