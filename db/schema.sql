DROP DATABASE IF EXISTS employees;
CREATE DATABASE employees;
USE employees;

CREATE TABLE department (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE role (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) UNIQUE NOT NULL,
  salary DECIMAL UNSIGNED NOT NULL,
  department_id INT UNSIGNED NOT NULL,
  INDEX dep_ind (department_id),
  CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

CREATE TABLE employee (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT UNSIGNED NOT NULL,
  INDEX role_ind (role_id),
  CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
  manager_id INT UNSIGNED,
  INDEX man_ind (manager_id),
  CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);

use employees;
INSERT INTO department
    (name)
VALUES
    ('Sales'),
    ('Support'),
    ('Marketing'),
    ('Executive');
INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Big Manager', 12000, 1),
    ('Assistant Manager', 4000, 1),
    ('Big Sales', 16000, 2),
    ('Sales', 8000, 2),
    ('Big Support', 13000, 3),
    ('Support', 7000, 3),
    ('Big CEO', 6200000000000, 4),
    ('CEO Assistant', 260000, 4);
INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Sleve', 'McDichael', 1, NULL),
    ('Onson', 'Sweemey', 2, 1),
    ('Darryl', 'Archideld', 3, NULL),
    ('Anatoli', 'Smorin', 4, 3),
    ('Rey', 'McSriff', 5, NULL),
    ('Glenallen', 'Mixon', 6, 5),
    ('Mario', 'McRlwain', 7, NULL),
    ('Raul', 'Chamgerlain', 8, 7);