require('dotenv').config()

const { inquirerMenu, inquirerPause, inquireLeerInput, inquireLugarSeleccionado } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");
require('colors');

console.log(process.env)
const main = async() => {
    const busquedas = new Busquedas()
    let opt;
    do{
        opt = await inquirerMenu()

        switch(opt) {
            case 1 :
                //Mostrar mensaje
                const {ciudad} = await inquireLeerInput('Ciudad:')
        
                //Buscar los lugares
                const ciudades = await busquedas.ciudad(ciudad)

                 //Seleccione el lugar
                 const idSel = await inquireLugarSeleccionado(ciudades)
                if(idSel === 0) continue;
                    
                const lugarSel = ciudades.find(l => l.id === idSel)
                //agregar al historial
                busquedas.agregarHistorial(lugarSel.nombre)
                //Clima
                const clima = await busquedas.clima(lugarSel.lat, lugarSel.lng)
            
                //mostrar resultados
                console.log('\n Información de la ciudad\n'.green)
                console.log('Ciudad:', lugarSel.nombre)
                console.log('Lat:', lugarSel.lat)
                console.log('Long:', lugarSel.lng)
                console.log('Estado del tiempo:', clima.descripcion)
                console.log('Temperatura', clima.temp)
                console.log('Mínima', clima.min)
                console.log('Máxima', clima.max)
            
            break;

            case 2:
                busquedas.mostrarHistorial()
            break;
        }
        if(opt !== 0 ) await inquirerPause();
    } while(opt !== 0)
}

main()