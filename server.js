//import package 
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
require("express-async-errors");
const helmet = require('helmet');
const crossitescripting = require('xss-clean');
const sanitize = require('express-mongo-sanitize');
//files import
const mongodb = require('./config/dbconfig');
const { troute } = require('./routes/testroute');
const { authroute } = require('./routes/authroute');
const { userroute } = require('./routes/userRoute');

//swagger oackage
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

//middleware
const { errorMiddlewre } = require('./middlewares/errormiddleware');
//dotenv config
dotenv.config();
console.log(process.env.Mongo_URL);
const { dbcon } = require('./config/dbconfig');

dbcon();

//rest object
const app = express();

//middleware
app.use(helmet());
app.use(crossitescripting());
app.use(sanitize());
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// swagger api config.
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            version: '1.0.0',
            title: 'job application portal',
            description: 'node expressjs job portal',

        },
        servers: [
            {
                url: 'http://localhost:3100/api/v1'
            }
        ]
    },
    apis: ['./routes/*.js'],

};

const swaggerSpec = swaggerJSDoc(options);
//route
app.use('/api/v1/test', troute);
app.use('/api/v1/job', authroute);
app.use('/api/v1/job', userroute);

//api doc route setup
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorMiddlewre);
//listen
PORT = 3100 || process.env.PORT

app.listen(PORT, () => {
    console.log(`server is running in ${process.env.Dev_Mode} Mode on port ${PORT}`);
})


