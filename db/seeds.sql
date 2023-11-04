-- Inserting seed data for department table
INSERT INTO department (name) VALUES ('Engineering');
INSERT INTO department (name) VALUES ('Marketing');
INSERT INTO department (name) VALUES ('HR');

-- Inserting seed data for role table
INSERT INTO role (title, salary, department_id) VALUES ('Software Engineer', 70000, 1);
INSERT INTO role (title, salary, department_id) VALUES ('Systems Architect', 90000, 1);

-- Assuming the 'Marketing' department has an ID of 2
INSERT INTO role (title, salary, department_id) VALUES ('Marketing Specialist', 55000, 2);
INSERT INTO role (title, salary, department_id) VALUES ('Graphic Designer', 45000, 2);

-- Assuming the 'HR' department has an ID of 3
INSERT INTO role (title, salary, department_id) VALUES ('HR Specialist', 50000, 3);

-- Inserting seed data for employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('John', 'Doe', 1, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Jane', 'Smith', 2, NULL);

-- And that 'John Doe' (employee with ID 1) is the manager for 'Emily'
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Emily', 'Johnson', 3, 1);
