const mysql = require('mysql2');
const inquirer = require('inquirer');
require('console.table');

const employeePrompt = {
    viewAllEmployees: "View All Employees",
    addEmployee: "Add An Employee",
    removeEmployee: "Remove An Employee",
    updateRole: "Update Employee Role",
    updateEmployeeManager: "Update Employee Manager",
    viewAllRoles: "View All Roles",
    exit: "Exit"
};

const connection = mysql.createConnection({
    host: 'localhost',
    // Default port
    port: 3306,
    user: 'root',
    password: 'maria',
    database: 'employee_db'
});

connection.connect(err => {
    if (err) throw err;
    prompt();
});

function prompt() {
    inquirer
        .prompt({
            name: 'action',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                employeePrompt.viewAllEmployees,
                employeePrompt.viewAllRoles,
                employeePrompt.addEmployee,
                employeePrompt.removeEmployee,
                employeePrompt.updateRole,
                employeePrompt.exit
            ]
        })
        .then(answer => {
            console.log('answer', answer);
            switch (answer.action) {
                case employeePrompt.viewAllEmployees:
                    viewAllEmployees();
                    break;

                case employeePrompt.addEmployee:
                    addEmployee();
                    break;

                case employeePrompt.removeEmployee:
                    remove('delete');
                    break;

                case employeePrompt.updateRole:
                    remove('roles');
                    break;

                case employeePrompt.viewAllRoles:
                    viewAllRoles();
                    break;

                case employeePrompt.exit:
                    connection.end();
                    break;
            }
        });
}

function viewAllEmployees() {
    const query = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, department.department_name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employees
    LEFT JOIN employees manager on manager.id = employees.manager_id
    INNER JOIN roles ON (roles.id = employees.role_id)
    INNER JOIN department ON (department.id = roles.department_id)
    ORDER BY employees.id;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('VIEW ALL EMPLOYEES');
        console.log('\n');
        console.table(res);
        prompt();
    });
};

function viewAllRoles() {
    const query = `SELECT roles.title, employees.id, employees.first_name, employees.last_name, department.department_name AS department
    FROM employees
    LEFT JOIN roles ON (roles.id = employees.role_id)
    LEFT JOIN department ON (department.id = roles.department_id)
    ORDER BY roles.title;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('VIEW EMPLOYEE BY ROLE');
        console.log('\n');
        console.table(res);
        prompt();
    });

}

async function addEmployee() {
    const addname = await inquirer.prompt(askName());
    connection.query('SELECT roles.id, roles.title FROM roles ORDER BY roles.id;', async (err, res) => {
        if (err) throw err;
        const { role } = await inquirer.prompt([
            {
                name: 'roles',
                type: 'list',
                choices: () => res.map(res => res.title),
                message: `What is the employee's role?:`
            }
        ]);
        let roleId;
        for (const row of res) {
            if (row.title === role) {
                roleId = row.id;
                continue;
            }
        }
        connection.query('SELECT * FROM employees', async (err, res) => {
            if (err) throw err;
            let choices = res.map(res => `${res.first_name} ${res.last_name}`);
            choices.push('none');
            let { manager } = await inquirer.prompt([
                {
                    name: 'manager',
                    type: 'list',
                    choices: choices,
                    message: `Choose the employee's manager: `
                }
            ]);
            let managerId;
            let managerName;
            if (manager === 'none') {
                managerId = null;
            } else {
                for (const data of res) {
                    data.fullName = `${data.first_name} ${data.last_name}`;
                    if (data.fullName === manager) {
                        managerId = data.id;
                        managerName = data.fullName;
                        console.log(managerId);
                        console.log(managerName);
                        continue;
                    }
                }
            }
            console.log('Employee added!');
            connection.query(
                'INSERT INTO employee SET ?',
                {
                    first_name: addname.first,
                    last_name: addname.last,
                    role_id: roleId,
                    manager_id: parseInt(managerId)
                },
                (err, res) => {
                    if (err) throw err;
                    prompt();

                }
            );
        });
    });

}
function remove(input) {
    const promptQ = {
        yes: "Yes",
        no: "No (Return to employee list)"
    };
    inquirer.prompt([
        {
            name: "action",
            type: "list",
            message: "You must delete an employee using their ID. Do you know the ID?",
            choices: [promptQ.yes, promptQ.no]
        }
    ]).then(answer => {
        if (input === 'delete' && answer.action === "yes") removeEmployee();
        else if (input === 'roles' && answer.action === "yes") updateRole();
        else viewAllEmployees();



    });
};

async function removeEmployee() {

    const answer = await inquirer.prompt([
        {
            name: "first",
            type: "input",
            message: "Enter the employee ID you want to remove:  "
        }
    ]);

    connection.query('DELETE FROM employee WHERE ?',
        {
            id: answer.first
        },
        function (err) {
            if (err) throw err;
        }
    )
    console.log('Employee removed!');
    prompt();

};

function askId() {
    return ([
        {
            name: "name",
            type: "input",
            message: "What is the employee's ID?:  "
        }
    ]);
};


async function updateRole() {
    const employeeId = await inquirer.prompt(askId());

    connection.query('SELECT roles.id, roles.title FROM roles ORDER BY roles.id;', async (err, res) => {
        if (err) throw err;
        const { role } = await inquirer.prompt([
            {
                name: 'roles',
                type: 'list',
                choices: () => res.map(res => res.title),
                message: 'What is the new role?: '
            }
        ]);
        let roleId;
        for (const row of res) {
            if (row.title === role) {
                roleId = row.id;
                continue;
            }
        }
        connection.query(`UPDATE employee 
        SET role_id = ${roleId}
        WHERE employees.id = ${employeeId.name}`, async (err, res) => {
            if (err) throw err;
            console.log('Role updated!')
            prompt();
        });
    });
};

function askName() {
    return ([
        {
            name: "first",
            type: "input",
            message: "Enter the first name: "
        },
        {
            name: "last",
            type: "input",
            message: "Enter the last name: "
        }
    ]);
};