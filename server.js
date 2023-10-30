// Local packages
const fs = require('fs');
const inquirer = require('inquirer');
const path = require('path');
const mysql = require('mysql2');
const express = require('express');
const { connection } = require('./db');
const router = express.Router();


// const PORT = process.env.PORT || 3001;

/*
Presented with options: 

View all departments
Presented with a formatted table showing department names and department ids
View all roles
Presented with the job title, role id, the department that role belongs to, and the salary for that role
View all employees
Presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
Add a department
Prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
Prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
Prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
Prompted to select an employee to update and their new role and this information is updated in the database
*/

function init() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'options',
            message: 'Select what you would like to do?',
            choices: [
                "View all departments", 
                "View all roles", 
                "View all employees", 
                "Add a department", 
                "Add a role", 
                "Add a an employee", 
                "Update an employee role",
                "Quit"
            ],
        },
    ]) 
    .then((answer) => {
        switch (answer.options) {
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Quit':
                Quit();
                break;
        }
    });
}

function promptMainMenu() {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'select an option.',
            choices: ['Main Menu', 'Quit'],
        }
    ])
    .then((answer) => {
        switch (answer.choice) {
            case 'Main Menu':
                init();
                break;
            case 'Quit':
                Quit();
                break;
        }
    });
}

function viewTable(tableName) {
    const request = `SELECT * FROM ${tableName}`;
    db.query(request, (err, res) => {
        if (err) throw err;
        console.log(`Viewing All ${tableName}`);
        console.table(res);
        promptMainMenu();
    });
}

function viewDepartments() {
    viewTable("department");
}

function viewEmployees() {
    viewTable("employees");
}



