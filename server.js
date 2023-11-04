// Local packages
const fs = require('fs');
const inquirer = require('inquirer');
const path = require('path');
const mysql = require('mysql2');
// const express = require('express')
const db = require('./config/connection.js');

db.connect((err) => {
    if (err) throw err;
    console.log(`Connected to the company_db database.`)
})

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
            case 'Add a department':
                newDepartment();
                break;
            case 'Add a role':
                newRole();
                break;
            case 'Add a an employee':
                newEmployee();
                break;
            case 'Update an employee role':
                updateEmployee();
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
};

function viewTable(tableName) {
    const request = `SELECT * FROM ${tableName}`;
    db.query(request, (err, res) => {
        if (err) throw err;
        console.log(`Viewing All ${tableName}`);
        console.table(res);
        promptMainMenu();
    });
};

function viewDepartments(tableName) {
    viewTable('department');
}
function viewRoles() {
    viewTable('role');
};

function viewEmployees() {
    viewTable("employee");
    const sql = `SELECT employee.id, employee.first_name AS "first name", employee.last_name 
                    AS "last name", role.title, department.name AS department, role.salary, 
                    concat(manager.first_name, " ", manager.last_name) AS manager
                    FROM employee
                    LEFT JOIN role
                    ON employee.role_id = role.id
                    LEFT JOIN department
                    ON role.department_id = department.id
                    LEFT JOIN employee manager
                    ON manager.id = employee.manager_id`
                    promptMainMenu();
};

function newDepartment() {

}

function newRole() {
    
}

function newEmployee() {
    connection.query("SELECT id as value, title as name from role", (err, data) => {
        const roles = data;
        inquirer.prompt ([
            {
                type: 'input',
                message: 'Enter employee first name.',
                name: 'FirstName'
            },
            {
                type: 'input',
                message: 'Enter employee last name.',
                name: 'LastName'
            },
            {
                type: 'list',
                message: 'Select your role',
                name: 'RoleId',
                choice: roles
            },
            {
                type: 'input',
                message: 'Enter their managers ID',
                name: 'ManagerID'
            }
            
        ])
        .then(function (response) {
            connection.query('INSERT INTO employees(first_name, last_name, roles_id, manager_id) VALUES (?,?,?,?)', 
            [response.FirstName, response.LastName, response.EmployeeID, response.ManagerID]), function(err,response) {
                if (err) throw err;
                console.table(res);
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'choice',
                        message: 'select an option.',
                        choices: [
                            'Main Menu',
                            'Quit'
                        ]
                    }
                ])
                .then((answer) => {
                    switch (answer.choice){
                        case 'Main Menu':
                            start();
                            break;
                            case 'Quit':
                                Quit();
                            }
                        })
                    }
                })
            })
};

function updateEmployee() {
    
}

function Quit() {
    console.log('Goodbye!');
    process.exit();
};

init();
