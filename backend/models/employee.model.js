const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },

    thumbnail: {
        type: String,
        required: true
    },
    
    email: {
        type: String,
        required: true,
        unique: true
    },

    phone: {
        type: String,
        required: true
    },

    department: {
        type: String,
        required: true
    },

    designation: {
        type: String,
        required: true
    },

    joiningDate: {
        type: Date,
        required: true
    },

    salary: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },

    skills: [
        {
            name: {
                type: String,
                required: true
            },
            level: {
                type: Number,
                required: true,
                min: 0,
                max: 100
            }
        }
    ],

    experience: [
        {
            company: {
                type: String,
                required: true
            },

            designation: {
                type: String,
                required: true
            },

            startDate: {
                type: Date,
                required: true
            },

            endDate: {
                type: Date,
                default: null
            },

            technologies: {
                type: [String],
                default: []
            }
        }
    ],

    projects: [
        {
            name: {
                type: String,
                required: true
            },

            role: {
                type: String,
                required: true
            },

            technologies: {
                type: [String],
                default: []
            },

            duration: {
                type: String,
                required: true
            }
        }
    ],

    address: {
        city: {
            type: String,
            required: true
        },

        state: {
            type: String,
            required: true
        },

        country: {
            type: String,
            required: true
        }
    }

}, {
    timestamps: true
});

const EmployeeSchema = mongoose.model("Employee", employeeSchema);

module.exports = EmployeeSchema;