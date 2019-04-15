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

## Webpack, Reactjs and Typescript
Although there is `create-react-app` toolkit to create react project very easily and quickly, I personally love to create 
the react project by using webpack from the beginning, and configure the project a bit by bit manually. It helps me how these
things work together.

When using webpack, you need a bunch of loaders to parse the specific file types. For example, `ts-loader` for Typescript,
`css-loader` for css files, `file-loader` for pictures...etc.

Before starting using webpack with typescript, you at least need to install the follows plugin:
`npm i -D css-loader file-loader html-webpack-plugin source-map-loader style-loader ts-loader typescript url-loader webpack webpack-cli`

In the [webpack.common.js](config/webpack.common.js) file, setup the entry point at first:
```
module.exports = {
  entry: [ './src/index.tsx'],
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].bundle.js'
  },
  resolve: {
    modules: [
      path.join(__dirname, '../dist'),
      'node_modules'
    ],
    extensions: [ '.ts', '.tsx', '.js', '.json' ]
  }
}
```
Then setup the loaders:
```
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'source-map-loader'
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.(jpe?g|png|gif|ico)$/i,
        use: [ 'file-loader' ]
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [ 'url-loader?limit=10000&mimetype=application/font-woff' ]
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [ 'file-loader' ]
      }
    ]
  }
```
Then setup the plugins:
```
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new CopyWebpackPlugin([
      {
        from: 'src/assets',
        to: 'assets'
      }
    ])
  ]
```
When you do frontend development, you want the browser reload the content automatically when you make change. To achieve this, you need `HotModuleReplacementPlugin`
and `webpack-dev-server`. So let's install something: `npm i -D webpack-dev-server webpack-merge`.
In the [webpack.dev.js](config/webpack.dev.js), since you want to merge the common setting, you need webpack-merge library, and use `HotModuleReplacementPlugin`
for browser reloading:
```
const merge = require('webpack-merge');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const common = require('./webpack.common.js');
const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: '../dist',
    historyApiFallback: true,
    hot: true,
    inline: true
  },
  plugins: [
    new HotModuleReplacementPlugin(),
    new DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      }
    })
  ]
});
```
And put the script in the package.json for starting the webpack dev server:
```
  "scripts": {
    "start": "webpack-dev-server --config ./config/webpack.dev.js --progress --profile --watch --open"
  }
```
Finally, let's look into bundle code for production. Since we want to reduce the bundle file size for production. We need to install some plugins for helping us:
`npm i -D compression-webpack-plugin uglifyjs-webpack-plugin`
In the [webpack.prod.js](config/webpack.prod.js), we use above plugins to bundle code:
```
const CompressionPlugin = require('compression-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const merge = require('webpack-merge');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new CompressionPlugin({
      filename: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0
    })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    },
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            warnings: false
          },
          sourceMap: true
        }
      })
    ]
  }
});
```

## Typescript, eslint and prettier
Since tslint will soon be deprecated in 2019, I use [eslint](https://eslint.org/) + [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) + 
[eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react) + [prettier](https://prettier.io/) for linting project.
Run `npm i -D @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-prettier eslint-plugin-prettier eslint-plugin-react prettier`
### TypeScript ESLint usage
Add `@typescript-eslint/parser` to the `parser` field and `@typescript-eslint` to the `plugins` section of [.eslintrc.json](.eslintrc.json) configuration file:
```
{
  "parser": "@typescript-eslint/parser",
    "plugins": [
      "@typescript-eslint"
    ],
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
  "plugins": [
    "react",
    "@typescript-eslint"
  ],
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
### prettier integrate with eslint using `eslint-plugin-prettier`
Append `prettier` into `plugins` section:
```
{
  "parser": "@typescript-eslint/parser",
  "plugins": [
    "prettier",
    "react",
    "@typescript-eslint"
  ]
}
```
Turn off the eslint formatting rule:
```
{
  "extends": [
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "prettier",
    "prettier/@typescript-eslint",
    "prettier/react"
  ],
  "rules": {
    "prettier/prettier": "error"
  }  
}
```
Setup the [.prettierrc](.prettierrc)
```
{
  "jsxSingleQuote": true,
  "jsxBracketSameLine": true,
  "printWidth": 120,
  "singleQuote": true,
  "trailingComma": "es5",
  "useTabs": false
}
```

## Live demo
https://react-beautiful-weather-app.firebaseapp.com/

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
