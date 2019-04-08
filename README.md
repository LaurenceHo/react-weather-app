# A weather web application using React, Redux, Typescript, Webpack4, Ant Design, D3v5, ECharts and firebase.

## Introduction
This project demonstrates how to use React, Redux, Typescript, Webpack4, Ant Design, D3v5 and ECharts. 
It is also including two kinds of D3 force simulation demonstrations along with gauge, which 
is based on my personal interest and previous project. 

Furthermore, this project also demonstrates how to deploy the web app to Google firebase, and use the cloud 
function serverless platform with React frontend app.

## Prerequisites
1. The latest version of Nodejs and npm need to be installed.
2. Google API Key
3. Dark Sky weather API key

## Getting started
* Clone the repo: `git clone https://github.com/LaurenceHo/reactjs-beautiful-weather.git`
* Install npm package: `npm install`
* Put your google & dark sky API key into `./functions/apiKey.js`
* Bundle frontend code: `npm run build`
* If you want to start client using webpack dev server: `npm run start`, and visit in your browser: `http://localhost:8080`.

## Write your own Google cloud functions:
Please visit: https://cloud.google.com/functions/ for more detail

## Deploy to firebase
1. Run `npm run firebase-init`
2. Visit `https://console.firebase.google.com` to create a new project
3. Add the firebase project into your local configuration `npm run firebase-add`
4. You may need to change the default project setting in the `.firebaserc`
5. If you want to deploy the whole project, run `npm run firebase-deploy`
6. If you want to deploy the cloud functions only, run `npm run deploy-functions`

## Typescript, eslint and prettier
Since tslint will soon be deprecated in 2019, I use [eslint](https://eslint.org/) + [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) + 
[eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react) + [prettier](https://prettier.io/) for linting project.
Run `npm i -D @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-prettier eslint-plugin-prettier eslint-plugin-react`
### TypeScript ESLint usage
Add `@typescript-eslint/parser` to the `parser` field and `@typescript-eslint` to the `plugins` section of .eslintrc.json configuration file:
```
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"]
}
```
Because we use Reactjs, we also need to set the `parserOptions` property:
```
{
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    }
  }
}  
```
### eslint-plugin-react usage
Append `react` to the `plugins` section:
```
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["react","@typescript-eslint"]
}
```
Indicate the reactjs version, add `settings` property:
```
{
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```
### prettier integrate with eslint
Append `prettier` into `plugins` section:
```
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["prettier","react","@typescript-eslint"]
}
```
Turn off the eslint formatting rule:
```
{
  "extends": [
    "prettier",
    "prettier/@typescript-eslint",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended"
  ]
}
```

## Live demo
https://react-beautiful-weather-app.firebaseapp.com/

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
