const fs = require('fs');
const axios = require('axios');
require('colors');

class Busquedas {
    historial= [];
    dbPath= './db/historial.json';
    get paramsMapbox(){
        return {
            'limit': 5,
            'language' : 'es',
            'access_token': process.env.MAPBOX_KEY
        }
    }
    get paramsOpenWeather(){
        return {
            'appid' : process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang' : 'es'
        }
    }

    get historialCapitalizado(){
        return this.historial.map(ciudad => {
            let palabras = ciudad.split(' ');
            palabras = palabras.map(palabra => palabra[0].toUpperCase() + palabra.substring(1));

            return palabras.join(' ')
        } )
       
    }

    constructor() {
        this.leerDB()
    }
    

    async ciudad( lugar = ''){
        try{
            // petición http
            // console.log(lugar)
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            })
            const resp = await instance.get()
            // const resp = await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/bogota.json?proximity=ip&types=place%2Cpostcode%2Caddress&language=es&access_token=pk.eyJ1Ijoic2ViYXNlcjk5IiwiYSI6ImNsMHk0dXJ6ajBmbWQzb3FoMHY3Znl4czQifQ.KDoq40N1Wn6-OEif87giXg')
            return resp.data.features.map(lugar =>({
                id:lugar.id,
                nombre: lugar.place_name,
                lng:lugar.center[0],
                lat: lugar.center[1]
            }))
           
            
        } catch(error){
            return []
            console.log('error')
        }
        
        return []; //retornar los lugares
    }

    async clima(lat, lon) {
        try{
            const instance = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: {...this.paramsOpenWeather, lat, lon}
            
            })
    
            const resp = await instance.get()
            const {weather} = resp.data
            const {main} = resp.data
            return {
                descripcion : weather[0].description,
                temp: main.temp,
                min: main.temp_min,
                max: main.temp_max
            }

        } catch(error) {
            return []
        }
       
    }

    agregarHistorial(ciudad = ''){
        if(this.historial.includes(ciudad.toLocaleLowerCase())){
            return;
        } else if (ciudad !== ''){
            //agregar ciudad al arreglo historial
            this.historial = this.historial.splice(0,4);
            this.historial.unshift(ciudad.toLocaleLowerCase())
            //guardar en DB arreglo historial
            this.guardarDB()
            
        }
        
    }

    mostrarHistorial(){
        
        if(this.historialCapitalizado.length !== 0){
            this.historialCapitalizado.forEach((h, i) => {
                const idx = `${i + 1}.`.green
                console.log(`${idx} ${h}`)
            })
        } else {
            console.log('Aún no hay busquedas para mostrar')
        }
    }

    guardarDB(){
        const payload= {
            historial: this.historial
        }

        fs.writeFileSync(this.dbPath, JSON.stringify(payload))
    }

    leerDB(){
        if(!fs.existsSync(this.dbPath)) return;

        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'})
        const data = JSON.parse(info)
        this.historial = data.historial
 
    }

    
}

module.exports = Busquedas;