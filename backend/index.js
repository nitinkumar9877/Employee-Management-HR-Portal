const express = require("express");
const app = express();
require('dotenv').config();
const mongoose = require("mongoose");
const cors = require("cors");

const EmployeeSchema = require("./models/employee.model");

app.use(cors({ origin: "http://localhost:3000" }));

mongoose.connect(process.env.MONGODBURL).then(() => {
    console.log("connect with db");
}).catch((err) => {
    console.log("fail to connect with db", err);
});

app.use(express.json());

app.post("/api/employees", async (req, res) => { // http://localhost:5000/api/employees
    const { firstName, lastName, thumbnail, email, phone, department, designation, joiningDate, salary, status, skills, experience, projects, address } = req.body;

    const employee = new EmployeeSchema({
        firstName,
        lastName,
        thumbnail,
        email,
        phone,
        department,
        designation,
        joiningDate,
        salary,
        status,
        skills,
        experience,
        projects,
        address
    });

    try {
        const savedEmployee = await employee.save();
        res.status(201).send("data saved successfully");
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})

app.get("/api/employees", async (req, res) => {
    console.log("req.query :", req.query);
    const { firstName, designation, department, status, page, pagination } = req.query;
    const filter = {};
    if (firstName) filter.firstName = firstName;
    console.log("first name is :", firstName)
    console.log("first name is :", filter.firstName)
    if (designation) filter.designation = designation;
    if (department) filter.department = department;
    if (status) filter.status = status;
    if (page) filter.status = page;
    if (pagination) filter.status = pagination;
    // const skip = (page - 1) * pagination;
    const employeesData = await EmployeeSchema.find(filter);
    res.send({
        status: 200,
        data: employeesData
    })
})

app.get("/api/employees/:id", async (req, res) => {
    const employeeId = req.params.id;
    console.log("selected employeeId :", employeeId);
    const selectedEmployeeData = await EmployeeSchema.findById(employeeId);
    res.send(selectedEmployeeData);
})

app.put("/api/employees/:id", async (req, res) => {
    const employeeId = req.params.id;
    const editableFields = [
        "firstName", "lastName", "email", "phone", "thumbnail", "department",
        "designation", "joiningDate", "salary", "status", "skills", "experience",
        "projects", "address"
    ];
    const updateEmployeeDataList = Object.fromEntries(
        editableFields
            .filter((field) => Object.hasOwn(req.body, field))
            .map((field) => [field, req.body[field]])
    );

    const updateEmployee = await EmployeeSchema.findByIdAndUpdate(employeeId, updateEmployeeDataList, { new: true });
    if (!updateEmployee) {
        return res.status(404).send({ message: "Employee not found" });
    }
    res.send({
        status: 200,
        msg: "Update SuccessFully",
        updateEmployee
    })
})

app.delete("/api/employees/:id", async (req, res) => {
    const employeeId = req.params.id;
    const deleteEmployee = await EmployeeSchema.findByIdAndDelete(employeeId);
    res.send({
        status: 200,
        msg: "Delete SuccessFully",
        deleteEmployee
    });
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});