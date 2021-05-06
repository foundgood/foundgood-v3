const inquirerDirectory = require('inquirer-directory');

// Packages
const Component = require('./plop/component').component;
const InitiativeWizardPage = require('./plop/initiativeWizardPage').component;

module.exports = function (plop) {
    // Preamble
    plop.addPrompt('directory', inquirerDirectory);
    plop.setHelper('curly', function (object, open) {
        return open ? '{' : '}';
    });

    // Component
    plop.setGenerator('Component', Component);
    plop.setGenerator('Initiative Wizard Page', InitiativeWizardPage);
};
