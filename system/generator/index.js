'use strict';
const CURR_DIR = process.cwd();
const fs = require('fs');
const pluralize = require('pluralize');
const chalk = require('chalk');
const caseChanger = require('case');

module.exports = async function (moduleArg) {
  try {
    const processName = moduleArg[1];
    const processAction = moduleArg[0].slice(5);
    const templatePath = `${__dirname}/sample`;
    let origFilePath = '';
    let contents = '';
    if (processAction != 'module') {
      let file = '';
      let destPath = '';
      let pluralProcessName = '';
      let camelPluralProcessName = '';
      let singularProcessName = '';
      let pascalSingularProcessName = '';
      let camelSingularProcessName = '';
      switch (processAction) {
        case 'controller':
          origFilePath = `${templatePath}/samples.controller.js`;
          pluralProcessName = pluralize.plural(processName);
          camelPluralProcessName = caseChanger.camel(pluralProcessName);

          file = `${camelPluralProcessName}.controller.js`;
          console.log(chalk.blueBright(`Creating Controller: ${file}`));
          contents = fs.readFileSync(origFilePath, 'utf8');
          contents = contents.replace(
            /CONTROLLER_CAMEL_CASE_PLURAL_FORM/g,
            camelPluralProcessName,
          );
          destPath = `${CURR_DIR}/app/controllers`;
          break;
        case 'model':
          origFilePath = `${templatePath}/sample.model.js`;
          singularProcessName = pluralize.singular(processName);
          pascalSingularProcessName = caseChanger.pascal(singularProcessName);
          camelSingularProcessName = caseChanger.camel(singularProcessName);

          file = `${camelSingularProcessName}.model.js`;
          console.log(chalk.blueBright(`Creating Model: ${file}`));
          contents = fs.readFileSync(origFilePath, 'utf8');
          contents = contents.replace(
            /MODEL_SINGULAR_FORM/g,
            pascalSingularProcessName,
          );
          destPath = `${CURR_DIR}/models`;
          break;
        case 'service':
          origFilePath = `${templatePath}/sample.service.js`;
          singularProcessName = pluralize.singular(processName);
          camelSingularProcessName = caseChanger.camel(singularProcessName);

          file = `${camelSingularProcessName}.service.js`;
          console.log(chalk.blueBright(`Creating Service: ${file}`));
          contents = fs.readFileSync(origFilePath, 'utf8');
          contents = contents.replace(
            /SERVICE_CAMEL_CASE_SINGULAR_FROM/g,
            camelSingularProcessName,
          );
          destPath = `${CURR_DIR}/app/services`;
          break;
        case 'validation':
          origFilePath = `${templatePath}/sample.validation.js`;
          singularProcessName = pluralize.singular(processName);
          camelSingularProcessName = caseChanger.camel(singularProcessName);

          file = `${camelSingularProcessName}.validation.js`;
          console.log(chalk.blueBright(`Creating Validation: ${file}`));
          contents = fs.readFileSync(origFilePath, 'utf8');
          contents = contents.replace(
            /VALIDATION_CAMEL_CASE_SINGULAR_FROM/g,
            `${camelSingularProcessName}`,
          );
          destPath = `${CURR_DIR}/app/validations`;
          break;
        case 'middleware':
          origFilePath = `${templatePath}/sample.middleware.js`;
          singularProcessName = pluralize.singular(processName);
          camelSingularProcessName = caseChanger.camel(singularProcessName);

          file = `${camelSingularProcessName}.middleware.js`;
          console.log(chalk.blueBright(`Creating Middleware: ${file}`));
          contents = fs.readFileSync(origFilePath, 'utf8');
          contents = contents.replace(
            /MIDDLEWARE_CAMEL_CASE_SINGULAR_FROM/g,
            `${camelSingularProcessName}`,
          );
          destPath = `${CURR_DIR}/app/middlewares`;
          break;
        default:
          break;
      }
      fs.mkdirSync(`${destPath}`, { recursive: true }, (err) => {});
      const writePath = `${destPath}/${file}`;
      if (!fs.existsSync(writePath)) {
        fs.writeFileSync(writePath, contents, 'utf8');
        console.log('Path:', chalk.greenBright(writePath));
        console.log(chalk.blueBright('File Generation Completed'));
      } else {
        console.error(chalk.redBright(`${file} already exists.`));
      }
    }
  } catch (error) {
    if (error.code === 'EEXIST') {
      console.error(chalk.redBright('Module already exists.'));
    } else {
      console.error(chalk.redBright(error.message));
    }
  }
};
