// Local packages
const fs = require('fs');
const inquirer = require('inquirer');
const path = require('path');
const mysql = require('mysql2');
// const express = require('express')
const db = require('./config/connection.js');
const mysqlProm = require('mysql2/promise');


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
    inquirer.prompt([
        {
            type: 'input',
            name: 'newDept',
            message: 'What is the name of the new department you want to add?',
        }
    ])
    .then((answers) => {
        const newDeptData = `INSERT INTO department (name) VALUES (?);`;
        const deptParams = [answers.newDept];
        
        db.query(newDeptData, deptParams, (error, results) => {
            if (error) {
                console.error('An error occurred:', error);
                return;
            }
            console.log('New department added successfully!', results);
            promptMainMenu();
        });
    })
};

function newRole() {
    db.query("SELECT id, name FROM department", (err, department) => {

        const departmentChoices = department.map(dept => ({
            name: dept.name,
            value: dept.id
        }))
        inquirer.prompt([
            {
                type: 'input',
                name: 'roleTitle',
                message: 'What is the title of the new role you want to add?',
            },
            {
                type: 'input',
                name: 'roleSalary',
                message: 'What is the salary of the new role you want to add?',
            },
            {    
                type: 'list',
                name: 'roleDept',
                message: 'What department is the new role you want to add?',
                choices: departmentChoices
            },
        ])
        .then((answers) => {
            const newRoleData = `
                INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);`;
            const roleParams = [answers.roleTitle, answers.roleSalary, answers.roleDept];
            
            db.query(newRoleData, roleParams, (error, results) => {
                if (error) {
                    console.error('An error occurred:', error);
                    return;
                }
                console.log('New role added successfully!', results);
                promptMainMenu();
            });
        })
    })
};

function newEmployee() {
    db.query("SELECT id as value, title as name from role", (err, data) => {
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
            db.query('INSERT INTO employees(first_name, last_name, roles_id, manager_id) VALUES (?,?,?,?)', 
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
    // First, fetch the roles so we can show them in the list
    db.query("SELECT id, title FROM role", (err, roles) => {
        if (err) {
            console.error('An error occurred fetching roles:', err);
            return;
        }

        // Add an option for adding a new role
        roles.push({ id: -1, title: "Add new role" });

        const roleChoices = roles.map(role => ({
            name: role.title,
            value: role.id
        }));

        // Now fetch the employees
        db.query("SELECT id, first_name, last_name FROM employee", (err, employees) => {
            if (err) {
                console.error('An error occurred fetching employees:', err);
                return;
            }

            const employeeChoices = employees.map(emp => ({
                name: `${emp.first_name} ${emp.last_name}`,
                value: emp.id
            }));

            // Ask the user to choose an employee and a role
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'empSelect',
                    message: 'Which employee are you looking to modify?',
                    choices: employeeChoices
                },
                {
                    type: 'list',
                    name: 'roleSelect',
                    message: 'Select the new role for the employee:',
                    choices: roleChoices
                }
            ])
            // .then((answers) => {
            //     // Check if the user selected the option to add a new role
            //     if (answers.roleSelect === -1) {
            //         // Prompt the user to create a new role
            //         return inquirer.prompt([
            //             {
            //                 type: 'input',
            //                 name: 'newRoleTitle',
            //                 message: 'What is the title of the new role?'
            //             },
            //             {
            //                 type: 'input',
            //                 name: 'newRoleSalary',
            //                 message: 'What is the salary for the new role?'
            //             }
            //         ]).then(newRoleAnswers => {
            //             // Insert the new role into the database
            //             return db.query("INSERT INTO role (title, salary) VALUES (?, ?)", [newRoleAnswers.newRoleTitle, newRoleAnswers.newRoleSalary])
            //                 .then(result => {
            //                     console.log('New role added successfully!');
            //                     // Return the id of the new role to update the employee
            //                     return result.insertId;
            //                 });
            //         });
            //     } else {
            //         // Return the selected role id
            //         return Promise.resolve(answers.roleSelect);
            //     }
            // })
            // .then(roleId => {
            //     // Update the employee with the new role
            //     const updateEmployeeSql = "UPDATE employee SET role_id = ? WHERE id = ?;";
            //     return db.query(updateEmployeeSql, [roleId, answers.empSelect]);
            // })
            .then(() => {
                console.log('Employee updated successfully!');
                promptMainMenu();
            })
            .catch((error) => {
                console.error('An error occurred:', error);
            });
        });
    });
}




function Quit() {
    console.log('Goodbye!');
    process.exit();
};

init();
