const component = {
    description: 'Generates a page for the initiative wizard',
    prompts: [
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of the new page?',
        },
        {
            type: 'confirm',
            name: 'modal',
            message: 'Should the page include logic for a modal window? [WIP]',
        },
    ],
    actions(data) {
        const actions = [
            {
                type: 'add',
                path: './pages/wizard/initiative/{{dashCase name}}.js',
                templateFile: './plop/templates/initiativeWizardPage/page.hbs',
            },
        ];

        return actions;
    },
};

module.exports = {
    component,
};
