const mongooseVar = require('mongoose');
const dbcon = async () => {
    try {
        const dbConnection = await mongooseVar.connect(process.env.Mongo_URL);
        console.log('database connected successfully');
    } catch (error) {
        console.log('error in db connection', error.message);
    }

}
module.exports = {
    dbcon
}


