const inquirer = require("inquirer");
require("colors");

const questions = [
    {
        type: "list",
        name: "option",
        message: "¿Qué desea hacer?",
        choices: [
            {
                value: 1,
                name: `${"1.".green} Buscar ciudad`,
            },
            {
                value: 2,
                name: `${"2.".green} Historial`,
            },
            {
                value: 0,
                name: `${"0.".green} Salir`,
            },
        ],
    },
];

const inquirerMenu = async () => {
    console.clear();
    console.log("===============".yellow);
    console.log("        Seleccione una opcion: ".cyan);
    console.log("===============\n".yellow);

    const { option } = await inquirer.prompt(questions);

    return option;
};

const questions2 = [
    {
        name: "enter",
        type: "input",
        message: `Presione ${"Enter".cyan} para continuar`,
    },
];

const pause = async () => {
    console.log("\n");
    await inquirer.prompt(questions2);
};

const readInput = async (message) => {
    const question = [
        {
            type: "input",
            name: "description",
            message,
            validate(value) {
                if (value.length === 0) {
                    return "por favor ingrese un valor";
                }
                return true;
            },
        },
    ];
    const { description } = await inquirer.prompt(question);
    return description;
};

const listPlaces = async (places = []) => {
    const choices = places.map((place, i) => {
        const idx = `${i + 1}`.green;

        return {
            value: place.id,
            name: `${idx} ${place.name}`,
        };
    });

    choices.unshift({
        value: "0",
        name: "0.".green + " Calcelar",
    });

    const questions = [
        {
            type: "list",
            name: "id",
            message: "Seleccione lugar:",
            choices,
        },
    ];

    const { id } = await inquirer.prompt(questions);

    return id;
};

const confirm = async (message) => {
    const question = [
        {
            type: "confirm",
            name: "ok",
            message,
        },
    ];
    const { ok } = await inquirer.prompt(question);
    return ok;
};

const showCheckList = async (tasks = []) => {
    const choices = tasks.map((task, i) => {
        const idx = `${i + 1}`.green;

        return {
            value: task.id,
            name: `${idx} ${task.description}`,
            checked: task.createdAt !== null ? true : false,
        };
    });

    const question = [
        {
            type: "checkbox",
            name: "ids",
            message: "Selecciones",
            choices,
        },
    ];

    const { ids } = await inquirer.prompt(question);

    return ids;
};

module.exports = {
    inquirerMenu,
    pause,
    readInput,
    listPlaces,
    confirm,
    showCheckList,
};
