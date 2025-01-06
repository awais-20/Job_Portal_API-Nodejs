const { default: mongoose } = require('mongoose');
const mongooseVar = require('mongoose');

const jobschema = new mongooseVar.Schema({
    company: {
        type: String,
        required: [true, "company name is required"]
    },
    position: {
        type: String,
        required: [true, " job position is required"],
        maxlength: 100,
    },
    status: {
        type: String,
        enum: ['pending', 'reject', 'interview'],
        default: 'pending'
    },
    worktype: {
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'internship'],
        default: 'contract'
    },
    worklocation: {
        type: String,
        default: 'pakistan',
        required: [true, 'work location is required'],
    },
    createdby: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    }
}, { timestamps: true });

const jobModel = mongooseVar.model('job', jobschema);

module.exports = {
    jobModel
}