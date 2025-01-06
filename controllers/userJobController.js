const userModel = require('../models/userModel');
const { jobModel } = require('../models/jobModel');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const moment = require('moment');
async function updateuser(req, resp, next) {
    async function GenerateToken(data) {
        return token = jwt.sign({ _id: data._id }, process.env.SECRET_KEY, { expiresIn: '1d' });
    }

    try {
        const { name, lastname, email, password, location } = req.body;

        if (!name || !email) {
            return resp.status(400).send({
                success: true,
                message: " Add all Required fields"
            });
        }
        const user = await userModel.findById(req.user.userId);
        if (!user) {
            return resp.status(403).send({
                success: true,
                message: " User Not Found"
            });
        }
        user.name = name,
            user.location = location,
            await user.save();
        const token = GenerateToken(user);
        return resp.status(200).send({
            success: true,
            message: "data updated successfully",
            user
        });
    }

    catch (error) {
        return next(error);
    }
}
async function createjob(req, resp, next) {
    try {
        const { company, position } = req.body;

        // Validate required fields
        if (!company || !position) {
            return resp.status(400).json({ error: "Company and position are required fields." });
        }

        // Add createdby field
        req.body.createdby = req.user.userId;

        // Create job
        const job = await jobModel.create(req.body);

        // Respond with the created job
        return resp.status(201).json({ job });
    } catch (error) {
        // Handle errors
        next(error);
    }
}
async function getjob(req, resp, next) {
    try {
        // Fetch jobs created by the authenticated user
        //const jobs = await jobModel.find({ createdby: req.user.userId });
        const { status, worktype, search, sort } = req.query;
        const query = {
            createdby: req.user.userId
        };
        if (status && status !== "all") {
            query.status = status;
        }
        if (worktype && worktype !== "all") {
            query.worktype = worktype;
        }
        if (search) {
            query.position = { $regex: search, $options: 'i' };
        }

        let queryresult = jobModel.find(query);
        if (sort === 'latest') {
            queryresult = queryresult.sort('-createdAt');
        }
        if (sort === 'oldest') {
            queryresult = queryresult.sort('createdAt');

        }
        if (sort === 'a-z') {
            queryresult = queryresult.sort('position');
        }
        if (sort === 'z-a') {
            queryresult = queryresult.sort('-position');
        }

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const result = jobModel.find(query);
        const totaljobs = await jobModel.countDocuments(query);
        const noofpage = Math.ceil(totaljobs / limit);
        const jobs = await result.skip(skip).limit(limit);
        return resp.status(200).json({
            success: true,
            totalCount: totaljobs,
            noOfPages: noofpage,
            jobs,
        });

    } catch (error) {
        // Handle errors and send appropriate response
        return resp.status(500).json({
            success: false,
            message: 'Failed to fetch jobs',
            error: error.message,
        });
    }
}
async function updateJob(req, resp, next) {
    const { id } = req.params;
    const { company, position } = req.body;
    if (!company || !position) {
        return next("Please Add Required Fields");
    }

    const job = await jobModel.findOne({ _id: id });

    if (!job) {
        return next(`no jobs found with this ${id}`);
    }

    if (req.user.userId !== job.createdby.toString()) {
        next("you re not authorized to update this job");
        return;
    }
    const updatejob = await jobModel.findOneAndUpdate({ _id: id }, req.body, {

        new: true,
        runValidators: true
    });

    return resp.status(200).json({ updatejob });
}
async function deletejob(req, resp, next) {
    try {
        const { id } = req.params;
        const job = await jobModel.findOne({ _id: id });

        if (!job) {
            return next("can not find any job");
        }
        if (req.user.userId !== job.createdby.toString()) {
            next("you are not authorized to delete this job");
            return;
        }

        await job.deleteOne();
        return resp.status(200).json({ message: "Job deleted successfully", job });
    } catch (error) {
        return next(error);
    }


}
async function stats(req, resp) {
    const stats = await jobModel.aggregate([
        {
            $match: {
                createdby: new mongoose.Types.ObjectId(req.user.userId),
            },
        },
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        }
    ]);
    const defaultStats = {
        pending: stats.pending || 0,
        interview: stats.interview || 0,
        accept: stats.accept || 0,
        reject: stats.reject || 0
    }

    let monthlyapplication = await jobModel.aggregate([
        {
            $match: {
                createdby: new mongoose.Types.ObjectId(req.user.userId)
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                },
                count: {
                    $sum: 1,
                },
            }
        }

    ]);
    monthlyapplication = monthlyapplication.map(item => {
        const { _id: { year, month }, count } = item
        const date = moment().month(month - 1).year(year).format("MMM Y")
        return { date, count };
    }).reverse();
    return resp.status(200).json({
        message: "Stats fetched successfully",
        totalStats: stats.length,
        stats,
        defaultStats,
        monthlyapplication
    });
}

module.exports = {
    updateuser,
    createjob,
    getjob,
    updateJob,
    deletejob,
    stats

}
