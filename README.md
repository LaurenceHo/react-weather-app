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

### How do I get set up? ###

* Clone the repo: 
```
git clone https://LaurenceHo@bitbucket.org/LaurenceHo/reactjs-beautiful-weather.git
```
or
```
git clone https://github.com/bluegray1015/reactjs-beautiful-weather.git
```

* Install npm package: 
```
npm i
```

* Put your google & dark sky API key into `./functions/apiKey.js`

* Launch the app: 
```
npm run start
```

* Visit in your browser: http://localhost:8080

### Write your own Google cloud functions:
Please visit: https://cloud.google.com/functions/ for more detail

### Deploy to firebase
1. Run `npm run firebase-init`
2. Visit https://console.firebase.google.com to create a new project
3. Add the firebase project into your local configuration `npm run firebase-add`
4. You may need to change the default project setting in the `./.firebaserc`
5. If you want to deploy the whole project, run `npm run firebase-deploy`
6. If you just want to deploy the cloud functions, run `npm run deploy-functions`

### Live demo
https://react-beautiful-weather-app.firebaseapp.com/

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
