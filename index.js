/*
GIVEN a command-line application that accepts user input
Presented with options: 
view all departments, view all roles, all employees, 
add a department, a role, an employee, and update an employee role
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

// Local packages
const fs = require('fs');
const inquirer = require('inquirer');
const path = require('path');

const questions = [
    {
        type: 'input',
        name: 'title',
        message: 'What is your project title?',
    },
    {
        type: 'input',
        name: 'description',
        message: "What is the description of your project?",
    },
    {
        type: 'input',
        name: 'motivation',
        message: 'What was your motivation?',
    },
    {
        type: 'input',
        name: 'install',
        message: 'What are the installation instructions for your project?',
    },
    {
        type: 'input',
        name: 'usage',
        message: 'What is the usage information?',
    },
    {
        type: 'input',
        name: 'credit',
        message: 'List out any contributors and source material.',
    },
    {
        type: 'list',
        name: 'license',
        message: 'What license are you using?',
        choices: ["MIT", "Apache-2.0", "BSD-2-Clause", "BSD-3-Clause", "none"],
    },
    {
        type: 'input',
        name: 'test',
        message: 'Describe your testing?',
    },
    {
        type: 'input',
        name: 'github',
        message: 'What is your GitHub username?',
    },
    {
        type: 'input',
        name: 'email',
        message: 'Enter your email',
    }
];