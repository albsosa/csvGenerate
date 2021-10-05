const mysql = require("mysql");

function obtener(connection, callback){
    let obtenerQuery =
    "select policyHolderJson from courtier_prod.policy where state = 'ACTIVE';";
    connection.query(obtenerQuery, function (err, result){
        if(err) throw err;
        callback(result);
        connection.end();
    });
}


module.exports = {
    obtener
}