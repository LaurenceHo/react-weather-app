# A beautiful weather web application using React, Redux, Typescript, Webpack4, Ant Design and D3v5.

## Introduction
This project demonstrates how to use React, Redux, Typescript, Webpack4, Ant Design and D3v5. 
It is also including two kinds of D3 force simulation demonstrations as well as gauge, which 
is based on my personal interest and previous project. 

Furthermore, this project also demonstrates how to deploy the web app to firebase, and use the cloud 
function as a server with React frontend.

## Prerequisites
The latest version of Nodejs and npm need to be installed.

### How do I get set up? ###

1.Clone the repo: 
```
git clone https://LaurenceHo@bitbucket.org/LaurenceHo/reactjs-beautiful-weather.git
```
or
```
git clone https://github.com/bluegray1015/reactjs-beautiful-weather.git
```

2.Install npm package: 
```
npm install
```

3.Launch the app: 
```
npm run start
```

4.Visit in your browser: http://localhost:8080

### Deploy to firebase
1. Run `npm run firebase-init`
2. Visit https://console.firebase.google.com to create a new project
3. Then run `npm run add`
4. If you want to deploy the whole project, run `npm run deploy`
5. If you just want to deploy the cloud functions, run `npm run functions`

### Live demo
https://react-beautiful-weather-app.firebaseapp.com/
