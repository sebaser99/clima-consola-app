const inquirer = require('inquirer');
require('colors');


const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        pageSize: 12,
        message: '¿Qué desea hacer?',
        choices:  [
            {
                value: 1,
                name: `${'1.'.green} Buscar ciudad`
            },
            {
                value: 2,
                name: `${'2.'.green} Historial`
            },
            {
                value: 0,
                name: `${'0.'.green} Salir`
            }
        ]
    } 
]

const inquirerMenu =  async()=> {
    console.clear();
    console.log('============================'.green);
    console.log('     Seleccione una opción  '.green);
    console.log('============================\n'.green);

    const {opcion} = await inquirer.prompt(preguntas)
    return opcion
}




const inquirerPause = async () => {
    const pausa = [
        {
            type: 'input',
            name: 'tecla',
            message: `Presione ${'ENTER'.green} para continuar`,
    
        }
    
    ]
    await inquirer.prompt(pausa)
}

const inquireLeerInput = async(message) => {
    const question = [
        {
            type: 'input',
            name: 'ciudad',
            message,
            validate(value){
                if(value.length === 0){
                    return 'Por favor ingrese un valor'
                }
                return true;
            }
        }
    ]
    const descripcion = await inquirer.prompt(question)
    return descripcion
}

const inquireLugarSeleccionado = async (lugares = [])=> {
    const opciones = lugares.map( (lugar, i) => {
        const idx = `${i + 1}.`.green
        return {
            value: lugar.id,
            name: `${idx} ${lugar.nombre}`

        }
    })
    opciones.unshift({
        value: 0,
        name: '0. '.green + 'Cancelar'
    })
    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione una ubicación',
            choices:  opciones
        }
    ]

    const {id} = await inquirer.prompt(preguntas)
    return id
} 

module.exports = {
    inquirerMenu,
    inquirerPause,
    inquireLeerInput,
    inquireLugarSeleccionado
}