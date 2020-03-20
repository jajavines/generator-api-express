'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

const parser = require('@babel/parser');
const generate = require('@babel/generator').default;
const traverse = require('@babel/traverse').default;

const _ = require('lodash');
const separator = "\n------------------------------------- \n";
/**
 * yo api-express:module <module-name>
 */
module.exports = class extends Generator {
    prompting() {
        // Have Yeoman greet the user.
        this.log(
            yosay(`Welcome to the impressive ${chalk.red('generator-api-express')} generator!`)
        );

        // Tell yeoman that an argument is expected from the CLI and to be stored under "name"
        this.argument("name", { type: String, required: true });

        const prompts = [];
        const moduleName = _.lowerCase(_.kebabCase(this.options.name));
        const moduleExists = this.fs.exists(this.destinationPath('app/' + moduleName + '/' + moduleName + '.routes.js'));

        this.options.name = moduleName;
        
        // Check if module alrady exists
        if (moduleExists) {
            prompts.push({
                type: 'confirm',
                name: 'overwrite',
                message: _.upperFirst(moduleName) + ' module already exists. Overwrite?',
                default: false
            });
        }

        return this.prompt(prompts).then(props => {
            props['moduleExists'] = moduleExists;
            this.props = props;
        });
    }

    writing() {
        const moduleName = this.options.name;
        this.log(separator);

        if (!this.props.moduleExists || (this.props.moduleExists && this.props.overwrite)) {
            this.log('Generating module: ' + moduleName);
            this.log(separator);

            // Force overwrite of file
            this.conflicter.force = true;

            generateModuleFiles(this, moduleName);
            addModuleToRoutes(this, moduleName);
        } else {
            this.log(_.upperFirst(moduleName) + ' NOT generated. Please choose another name.');
        }
    }

    install() {
        // this.installDependencies();
    }
};

/**
 * ------------------------
 * Generate Template Files
 * ------------------------
 */ 
function generateModuleFiles(generator, moduleName) {
    // Force overwrite of file
    generator.log('Generating files for "' + moduleName + '"...');
    
    generator.fs.copyTpl(
        generator.templatePath('module.routes.js'),
        generator.destinationPath('app/' + moduleName + '/' + moduleName + '.routes.js'),
        {
            name: moduleName,
            title: _.upperFirst(moduleName),
            className: _.camelCase(moduleName)
        }
    );
    generator.log(separator);
}

/**
 * ------------------------
 * Add new module to routes
 * ------------------------
 */    
function addModuleToRoutes(generator, moduleName) {
    generator.log('Adding "' + moduleName + '" module to routes...');
    const apiFile = generator.destinationPath('app/api.js');
    const content = generator.fs.read(apiFile);
    const source = content.toString();
    const ast = parser.parse(source);

    // Iterate content to find routes variable declaration
    traverse(ast, {
        enter(path) {
            //Add new route when found
            if (path.node.type === "VariableDeclarator" && path.node.id.name === "routes") {
                const existing = _.find(path.node.init.elements, function(obj) { 
                    return obj.type === 'StringLiteral' && obj.value === moduleName; 
                });

                // Check if route already exists
                if (_.isUndefined(existing)) {
                    path.node.init.elements.push({
                        type: 'StringLiteral',
                        value: moduleName
                    });
                }
            }
        }
    });

    // Write changes to file
    const {code} = generate(ast, {}, source);
    generator.fs.write(generator.destinationPath('app/api.js'), code);
    generator.log(separator);
}