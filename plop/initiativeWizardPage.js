const component = {
    description: 'Generates a page for the initiative wizard',
    prompts: [
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of the new page?',
        },
    ],
    actions(data) {
        const actions = [
            {
                type: 'add',
                path: './pages/wizard/[initiativeId]/{{dashCase name}}.js',
                templateFile: './plop/templates/initiativeWizardPage/page.hbs',
            },
        ];

        return actions;
    },
};

module.exports = {
    component,
};
