/* eslint-disable */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const fetch = require('isomorphic-fetch');
const prettier = require('prettier');
const CodeGen = require('swagger-js-codegen').CodeGen;

const pathToApiDir = path.resolve(__dirname, '..', 'src');
const templatePath = path.resolve(__dirname, 'templates');
const filename = 'API.js';
fetch(`${process.env.REACT_APP_AUTH_BASE_URL}/swagger`)
  .then(response => response.json())
  .then(swagger => {
    const source = CodeGen.getCustomCode({
      className: filename.replace('.js',''),
      swagger,
      beautify: false,
      lint: false,
      template: {
        class: fs.readFileSync(
          path.resolve(templatePath, 'react-template.mustache'),
          'utf-8',
        ),
        method: fs.readFileSync(
          path.resolve(templatePath, 'method.mustache'),
          'utf-8',
        ),
        type: fs.readFileSync(
          path.resolve(templatePath, 'type.mustache'),
          'utf-8',
        ),
      },
    });
    if (!fs.existsSync(pathToApiDir)) {
      throw Error(`Path ${pathToApiDir} does not exists!`);
    }
    fs.writeFileSync(
      path.resolve(pathToApiDir, filename),
      prettier.format(
        source,
        prettier.resolveConfig.sync(path.resolve(__dirname, '..')),
      ),
    );
  })
  .catch(e => {
    console.error(e);
  });
