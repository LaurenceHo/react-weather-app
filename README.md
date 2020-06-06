# ☀️🌤⛈❄️ A weather web application using React, Redux, TypeScript, Webpack4, Ant Design, ECharts and firebase.

## Table of Contents
- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Local development](#local-development)
- [Write Your Own Google Cloud Functions](#write-your-own-google-cloud-functions)
- [Deploy to Firebase](#deploy-to-firebase)
- [Webpack, Reactjs and TypeScript](#webpack-reactjs-and-typescript)
- [TypeScript, Eslint and Prettier](#typescript-eslint-and-prettier)
- [Ant Design](#ant-design)
- [ECharts](#echarts)
- [Windy API](#windy-api)
- [Mapbox](#mapbox)

## Introduction
This project demonstrates how to use ReactJS, Redux, TypeScript, Webpack4, [Ant Design](https://ant.design/docs/react/introduce), 
D3v5, [ECharts](https://echarts.apache.org/index.html) and [Mapbox](https://www.mapbox.com). 
It is also including two kinds of D3 force simulation demonstrations along with gauge, which is based on 
my personal interest and previous project. 

Furthermore, this project also demonstrates how to deploy the web app to Google firebase, and use Google 
cloud function serverless platform with React frontend app.

## Live demo
[React Weather App](https://reactjs-weather.web.app/)

## Prerequisites
1. The latest version of Nodejs and npm need to be installed
2. Google Geocoding API Key
3. Google Firebase project
4. Dark Sky weather API key
5. Windy API key
6. Mapbox API key

[NOTE] Since I already placed protection to all keys, you cannot use my own key. You have to apply for your own API key.

## Local development
* Clone the repo: `git clone https://github.com/LaurenceHo/react-weather-app.git`
* Install npm package: `npm i`
* If you want to start client using webpack dev server: `npm run start`, and visit in your browser: `http://localhost:8080`.
* Because we don't want to use Google Cloud Function when we do local development, we write simple NodeJs Express server for
returning mock JSON response. Move to [dev-server](dev-server) folder `cd dev-server`, and run `npm i` to install the npm modules.
After that, run `npm start` to start NodeJs Express Server and we can move forward to frontend development.
* Put your [Windy API key](https://api4.windy.com/) and Mapbox API key into [`./src/constants/api-key.ts`](src/constants/api-key.ts)
* For bundling frontend code run `npm run build`

[Back to the top↑](#table-of-contents)

## Write Your Own Google Cloud Functions:
Please visit: [Google Cloud Functions](https://firebase.google.com/docs/functions) for more detail

## Deploy to Firebase
* Put your Google Geocoding API Key and [dark sky API key](https://darksky.net/dev) into [`./functions/apiKey.js`](./functions/apikey.js).
* Change the Google Cloud Function URL `CLOUD_FUNCTION_URL` in [api.ts](./src/api.ts) to your own Google Cloud Function URL.
* Run `npm run firebase-init`
* Visit `https://console.firebase.google.com` to create a new project
* Add the firebase project into your local configuration `npm run firebase-add`
* You may need to change the default project setting in the `.firebaserc`
* If you want to deploy the whole project, run `npm run firebase-deploy`
* If you want to deploy the cloud functions only, run `npm run deploy-functions`

[Back to the top↑](#table-of-contents)

## Webpack, Reactjs and TypeScript
Although there is `create-react-app` toolkit to create ReactJS project very easily and quickly, I personally love creating 
the ReactJS project by using webpack from the beginning. Also configure the project a bit by bit manually. It helps me to 
understand how these things work together.

When using webpack, we need a bunch of loaders to parse the specific file types. For example, `ts-loader` for Typescript,
`css-loader` for css files, `file-loader` for pictures...etc.

Before starting using webpack with TypeScript, we at least need to install the following plugins:
`npm i -D css-loader file-loader html-webpack-plugin source-map-loader style-loader ts-loader typescript webpack webpack-cli`

In the [webpack.common.js](config/webpack.common.js) file, setup the entry point at first:
```
module.exports = {
  entry: ['./src/index.tsx'],
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].bundle.js',
  },
  resolve: {
    modules: [path.join(__dirname, '../dist'), 'node_modules'],
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
}
```

Then setup the loaders:
```
{
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      },
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
        test: /\.(ttf|eot|svg|woff|woff2)(\?.+)?$/,
        loader: 'file-loader?name=[hash:12].[ext]',
      },
    ]
  }
}
```

If we want to extract CSS into separate files, we need to install `mini-css-extract-plugin`, and replace style loader:
```
  {
    test: /\.css$/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
        options: {
          hmr: process.env.NODE_ENV === 'development',
        },
      },
      'css-loader',
    ],
  },
```

Then setup the plugins:
```
{
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
}
```

[Back to the top↑](#table-of-contents)

### Webpack Dev Server and Hot Module Replacement
When we do frontend development, we want the browser reloading the content automatically when we make changes. To achieve this, 
we need `WebpackDevServer`. So let's install something: `npm i -D webpack-dev-server webpack-merge`.
In the [webpack.dev.js](config/webpack.dev.js), since we want to merge the common setting, we need `webpack-merge` library along 
with `WebpackDevServer` for browser reloading:
```
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: '../dist',
    historyApiFallback: true,
    hot: true,
    inline: true,
  },
  plugins: [
    new DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
});
```

And place `start` script in the package.json for starting the webpack dev server:
```
  "scripts": {
    "start": "webpack-dev-server --config ./config/webpack.dev.js --progress --profile --watch --open"
  }
```

[Back to the top↑](#table-of-contents)

### Optimising Application Bundle Size
Finally, let's look into bundling code for production deployment. Since we want to reduce the bundle file size for production
as much as possible, we need to install some plugins for helping us: `npm i -D terser-webpack-plugin`. We also need 
`CleanWebpackPlugin` to clean the build folder (dist) before building code, as well as `MiniCssExtractPlugin` for extracting 
CSS files. Therefore, in the [webpack.prod.js](config/webpack.prod.js), we use above plugins to bundle code:
```
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const merge = require('webpack-merge');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css',
    }),
    new CleanWebpackPlugin(),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        terserOptions: {
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
});
```

[Back to the top↑](#table-of-contents)

## TypeScript, Eslint and Prettier
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

Because we use ReactJS, we also need to set the `parserOptions` property:
```
{
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    }
  }
}  
```

[Back to the top↑](#table-of-contents)

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

Indicate the ReactJS version, add `settings` property:
```
{
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

[Back to the top↑](#table-of-contents)

### Prettier Integrate with Eslint Using `eslint-plugin-prettier`
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

[Back to the top↑](#table-of-contents)

## Ant Design
### Getting Started
Ant Design React is dedicated to providing a good development experience for programmers. Make sure that you have installed 
Node.js(> 8.0.0) correctly. Then run `npm i antd`

### Usage
Ant design provides abundant UI components, which means the library size is quite large. I usually only import the 
component I needed rather than import everything.
Import CSS files in the `index.tsx`:
```
import 'antd/es/col/style/css';
import 'antd/es/row/style/css';
```

Import necessary packages e.g in the `current-weather.tsx`:
```
import Col from 'antd/es/col';
import Row from 'antd/es/row';

export class CurrentWeather extends React.Component<any, any> {
  render() {
    const { weather, location, timezone, filter } = this.props;

    return (
      <div>
        <Row justify='center' className='current-weather-top'>
          <Col xs={4} sm={4} md={4} lg={3} xl={3}>
          ......
          </Col>
        </Row>
      </div>
    );
  }
}          
```

[Back to the top↑](#table-of-contents)

### Customise theme
If we want customise ant design theme, make sure we install `less-loader` and `style-loader` at first. In the [webpack.common.js](config/webpack.common.js),
add `less-loader` for parsing *.less files along with other loaders:
```
module.exports = {
  rules: [
    {
      test: /\.less$/,
      use: [
        {
          loader: 'style-loader',
        }, 
        {
          loader: 'css-loader', // translates CSS into CommonJS
        }, 
        {
          loader: 'less-loader', // compiles Less to CSS
          options: {
            modifyVars: {
              'primary-color': '#1DA57A',
              'link-color': '#1DA57A',
              'border-radius-base': '2px',
              // or
              'ant-theme-file': "~'your-less-file-path.less'", // Override with less file
            },
            javascriptEnabled: true,
          },
        }
      ],
    },
     // ...other rules
  ],
  // ...other config
}
```
We can look at [here](https://ant.design/docs/react/customize-theme) for getting the further detail.

[Back to the top↑](#table-of-contents)

### TypeScript
* Don't use `@types/antd`, as antd provides a built-in ts definition already.

## ECharts
### Getting Started
`npm i echarts -S` and `npm i -D @types/echarts`

### Usage
Keep in mind, we only import the packages on demand. So in our TypeScript files, we import ECharts components as below:
```
// Import the main module of echarts.
import * as echarts from 'echarts/lib/echarts';
// Import line chart.
import 'echarts/lib/chart/line';
// Import components of tooltip, title and toolbox.
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/toolbox';
```

[Back to the top↑](#table-of-contents)

## Windy API
Since I put the protection for my Windy API, only the allowed domain name can use this API key. Windy API is free, 
please feel free to apply for a new one for yourself.

### Usage
There is no npm package for installing Windy API so we have to import source in [index.html](./src/index.html)
```
<head>
    <script src="https://unpkg.com/leaflet@1.4.0/dist/leaflet.js"></script>
    <script src="https://api4.windy.com/assets/libBoot.js"></script>
</head> 
```
Windy API v4 was based on Leaflet 1.4, so import leaflet by this way is very important. 
How to make these 2 JavaScript 3rd party libraries working in TypeScript? We need to declare the definition in [TypeScript
Declaration File](./src/typings.d.ts).
```
declare const windyInit: any;
declare const L: any;
```
After that, we can use `windyInit` and `L` these 2 parameters directly without importing module into TypeScript file.
In [`weather-map.tsx`](src/views/weather-map.tsx), when we init Windy API, the basic usage it's very simple:
```
export const WeatherMap: React.FC<any> = () => {
    const renderMap = () => {
        const options = {
            // Required: API key
            key: 'PsLAtXpsPTZexBwUkO7Mx5I',
            // Put additional console output
            verbose: true,
            // Optional: Initial state of the map
            lat: 50.4,
            lon: 14.3,
            zoom: 5,
        }
        windyInit(options, (windyAPI: any) => {
            const { map } = windyAPI;
            L.popup()
            .setLatLng([50.4, 14.3])
            .setContent("Hello World")
            .openOn( map );
        });
    }

    useEffect(() => {
        renderMap();
    }, []);

    render() {
        return (<div id='windy' />);
    }
}
```
[Back to the top↑](#table-of-contents)

## Mapbox
Before starting using Mapbox, get an API for your project. Please go to 
[Mapbox](https://www.mapbox.com/maps/) for further detail.
### Usage
Import source in [index.html](./src/index.html):
```
<head>
    <script src="https://api.mapbox.com/mapbox-gl-js/v1.9.0/mapbox-gl.js"></script>
    <link href="https://api.mapbox.com/mapbox-gl-js/v1.9.0/mapbox-gl.css" rel="stylesheet" />
</head> 
```

Don't forget to declare Mapboxx the definition in [TypeScript Declaration File](./src/typings.d.ts):
```
declare const mapboxgl: any;
```

After declare `mapboxgl` definition, we can now start using mapbox:
```
mapboxgl.accessToken = 'pk.eyJ1IjoiYmx1ZWdyYXkiLCJhIjoiY2s4ZmdqdGRvMDQ0ZDNkcWpnbno1MGVzcyJ9.fnjAFHv0etBrY1LeIksTnA';
const map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 9 // starting zoom
});
```

Then we can start using Mapbox very easily:
```
export const Mapbox: React.FC = () => {
    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoiYmx1ZWdyYXkiLCJhIjoiY2s4ZmdqdGRvMDQ0ZDNkcWpnbno1MGVzcyJ9.fnjAFHv0etBrY1LeIksTnA';
        const map = new mapboxgl.Map({
            container: 'map', // container id
            style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
            center: [-74.5, 40], // starting position [lng, lat]
            zoom: 9 // starting zoom
        });
    }, []);

    render() {
        return (<div id='map' style={{width: 900, height: 500}}/>);
    }
}
```
You can find more examples from [here](https://docs.mapbox.com/mapbox-gl-js/examples/)

[Back to the top↑](#table-of-contents)

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
