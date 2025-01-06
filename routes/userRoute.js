const express = require('express');

const userroute = express.Router();
const { userAuth } = require('../middlewares/authmiddleware');
const { updateuser, createjob, getjob, updateJob, deletejob, stats } = require('../controllers/userJobController');

/*
@swagger
 api/v1/job/get-job:
  get:
   summary: get all users
     responses:
      200:
        description: list of users:
         content:
          application/json:
           schema:
            type:array
             items:
              type:object
                properties:
                  name:
                   type:string
                    example: awais
                     lastname:
                      type:string
                       example:Rana
                        email:
                         type:string
                          example:ali@gmail.com
                           password:
                            type:string
                             example:Awais@123
                             location:
                              type:string
                               example:Rawalpindi
 */

// user update route
userroute.put('/update/user', userAuth, updateuser);
//create job route
userroute.post('/job-create', userAuth, createjob);
//get job route
userroute.get('/get-job', userAuth, getjob);
//========update job================//
userroute.patch('/update-job/:id', userAuth, updateJob);

//delete jobs
userroute.delete('/delete-job/:id', userAuth, deletejob);

//stats and fillters
userroute.get('/stats-job', userAuth, stats);

module.exports = {
    userroute
}      
