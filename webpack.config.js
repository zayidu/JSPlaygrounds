const path = require('path');

module.exports = {
  entry: [
    './src/index.js'
  ],
  output: {
    path: __dirname,
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        loader: 'babel'
      },{
        test: /\.css/,
        loaders: ['style', 'css']
      },{
        test: /\.scss/,
        exclude: /node_modules/,
        loaders: ['style', 'css', 'sass']
      },{
        test: /.(png|woff(2)?|eot|ttf|svg)(\?[a-z0-9=\.]+)?$/,
        loader: 'url-loader?limit=100000'
      }
    ]
  },
  resolve: {
    root: path.resolve(__dirname, 'src'),
    extensions: ['', '.js', '.jsx', '.scss', '.css']
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './'
  }
};
