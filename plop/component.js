const inquirer = require('inquirer');

const component = {
    description: 'Generates a basic component',
    prompts: [
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of the new component?',
        },
        {
            type: 'directory',
            name: 'directory',
            message: 'Where should the component be placed?',
            basePath: './',
        },
    ],
    actions(data) {
        const actions = [
            {
                type: 'add',
                path: './{{directory}}/{{camelCase name}}/index.js',
                templateFile: './plop/templates/component/index.hbs',
            },
            {
                type: 'add',
                path:
                    './{{directory}}/{{camelCase name}}/{{camelCase name}}.js',
                templateFile: './plop/templates/component/component.hbs',
            },
        ];

        return actions;
    },
};

module.exports = {
    component,
};
