const mongoose = require('mongoose');


const dbConnection = async () => {

    try {

        await mongoose.connect( process.env.DB_CONNECT);

        console.log("DB conectada");

    } catch (error) {
        console.log(error);

        throw new Error("No se pudo conectar a mongoDB");
    }
}

module.exports={
    dbConnection
}