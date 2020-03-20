'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the superior ${chalk.red('generator-api-express')} generator!`)
    );

    const prompts = [
      // {
      //   type: 'confirm',
      //   name: 'someAnswer',
      //   message: 'Would you like to enable this option?',
      //   default: true
      // }
      {
        type: 'input',
        name: 'name',
        message: 'Your project name: ',
        default: this.appname //Defaults to the project's folder name if the input is skipped
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'), {
        name: this.props.name
      }
    );
  }

  app() {
    // app directory
    this.fs.copy(
      this.templatePath('app/'),
      this.destinationPath('app/')
    );

    // bin directory
    this.fs.copy(
      this.templatePath('bin/'),
      this.destinationPath('bin/')
    );

    /**
     *  Can't include empty directory
     * 
     */
    // // core directory
    // this.fs.copy(
    //   this.templatePath('core/'),
    //   this.destinationPath('core/')
    // );

    // app.js
    this.fs.copy(
      this.templatePath('app.js'),
      this.destinationPath('app.js')
    );
  }

  install() {
    this.installDependencies();
  }
};
