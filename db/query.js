const {Pool} = require('pg');
const moment = require('moment');

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "bancosolar",
    password: "raby1949",
    port: 5432,
});

//INSERTAR - C (CREATE)

const agregarUsuario = async (datos) =>{
    const consulta = {
        text: "INSERT INTO usuarios (nombre, balance, estado) VALUES ($1, $2, true) RETURNING*;",
        values: datos,
    };

    try{
        const result = await pool.query(consulta);
        return result;
    }catch(error){
        console.log(`El error se encuentra en la tabla: ${error.table}.
        El detalle del error es: ${error.detail}.
        El codigo de error es: ${error.code}.
        Restricción violada: ${error.constraint}.`);
    }

}

//LEER -R (READ)

const tablaUsuarios = async () =>{
    try{
        const result= await pool.query("SELECT * from usuarios WHERE estado = true");
        return result;
    }catch(error){
        console.log(`El error se encuentra en la tabla: ${error.table}.
        El detalle del error es: ${error.detail}.
        El codigo de error es: ${error.code}.
        Restricción violada: ${error.constraint}.`);
    }
}


//EDITAR -U (UPDATE)
const editar = async (datos) => {
    //console.log(datos);
    const consulta = {
        text: "UPDATE usuarios SET nombre = $2, balance = $3 WHERE id=$1 RETURNING *;",
        values: datos,
    };
    try {
        const result = await pool.query(consulta);
        return result;
    } catch (error) {
        console.log(`El error se encuentra en la tabla: ${error.table}.
        El detalle del error es: ${error.detail}.
        El codigo de error es: ${error.code}.
        Restricción violada: ${error.constraint}.`);
    }
};

//ELIMINAR -D (DELETE)

const eliminar = async (id) => {
    try {
        const result = await pool.query(`UPDATE usuarios SET estado = false WHERE id = '${id}'`);
        return result;
    } catch (error) {
        console.log(`El error se encuentra en la tabla: ${error.table}.
        El detalle del error es: ${error.detail}.
        El codigo de error es: ${error.code}.
        Restricción violada: ${error.constraint}.`);
    }

};

//REALIZAR TRANSFERENCIA EDITAR -U (UPDATE)
const realizarTransferencia = async (datos) =>{

    const transfer = {
        text: `INSERT INTO transferencias (emisor, receptor, monto, fecha) VALUES ($1, $2, $3, '${moment().format('L')} ${moment().format('LTS')}')`,
        values: [Number(datos[0]), Number(datos[1]), Number(datos[2])]
    };

    const abono = {
        text: "UPDATE usuarios SET balance = balance + $2 WHERE id =$1",
        values: [Number(datos[1]), Number(datos[2])]
    };

    const descuento = {
        text: "UPDATE usuarios SET balance= balance - $2 WHERE id=$1",
        values: [Number(datos[0]), Number(datos[2])]
    }

    try{
        await pool.query("BEGIN");
        await pool.query(transfer);
        await pool.query(abono);
        await pool.query(descuento);
        await pool.query("COMMIT");
        return true;
    }catch(error){
        console.log(`El error se encuentra en la tabla: ${error.table}.
        El detalle del error es: ${error.detail}.
        El codigo de error es: ${error.code}.
        Restricción violada: ${error.constraint}.`);
        await pool.query("ROLLBACK");
        return error.code;
    }

}


//MOSTRAR TRANSFERENCIAS LEER -R (READ)
const tablaTransferencias = async () =>{
    const consulta = {
        rowMode: "array",
        text: "SELECT fecha,nombre, (SELECT nombre from usuarios WHERE usuarios.id=transferencias.receptor), monto from transferencias INNER JOIN usuarios on transferencias.emisor= usuarios.id"  
    };
    try{
        const result= await pool.query(consulta);
        return result.rows;
    }catch(error){
        console.log(`El error se encuentra en la tabla: ${error.table}.
        El detalle del error es: ${error.detail}.
        El codigo de error es: ${error.code}.
        Restricción violada: ${error.constraint}.`);
    }

}

module.exports ={agregarUsuario, tablaUsuarios, editar, eliminar, realizarTransferencia, tablaTransferencias}