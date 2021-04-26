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
            basePath: './components',
        },
        {
            type: 'checkbox',
            name: 'detailArray',
            message: 'Which batteries should be included?',
            choices: [
                new inquirer.Separator(''),
                new inquirer.Separator('- Data fetching -'),
                { name: 'SWR client side', value: 'swr' },
                {
                    name: 'getStaticProps',
                    value: 'getStaticProps',
                },
                { name: 'getStaticPaths', value: 'getStaticPaths' },
                new inquirer.Separator(''),
                new inquirer.Separator('- Misc -'),
                { name: 'Dynamic import', value: 'dynamicImport' },
            ],
        },
    ],
    actions(data) {
        // Reformat details
        data.details = data.detailArray.reduce(
            (acc, detail) => ({ ...acc, [detail]: true }),
            {}
        );

        const actions = [
            {
                type: 'add',
                path: './components/{{directory}}/{{camelCase name}}/index.js',
                templateFile: './plop/templates/component/index.hbs',
            },
            {
                type: 'add',
                path:
                    './components/{{directory}}/{{camelCase name}}/{{camelCase name}}.js',
                templateFile: './plop/templates/component/component.hbs',
            },
        ];

        return actions;
    },
};

module.exports = {
    component,
};
