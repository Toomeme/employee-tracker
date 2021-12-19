INSERT INTO department (department_name)
VALUES
    ('Sales'),
    ('Support'),
    ('Marketing'),
    ('Executive');
INSERT INTO roles (title, salary, department_id)
VALUES
    ('Big Manager', 12000, 1),
    ('Assistant Manager', 4000, 1),
    ('Big Sales', 16000, 2),
    ('Sales', 8000, 2),
    ('Big Support', 13000, 3),
    ('Support', 7000, 3),
    ('Big CEO', 62000, 4),
    ('CEO Assistant', 260000, 4);
INSERT INTO employees
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