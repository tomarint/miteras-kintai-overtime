const path = require("path");
const ejs = require("ejs");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlMinimizerPlugin = require("html-minimizer-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const JsonMinimizerPlugin = require("json-minimizer-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack"); // Import DefinePlugin
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin"); // Type checking plugin

const packageJson = require('./package.json'); // Import package.json to get the version

const browsers = ['chrome', 'firefox', 'edge']; // List of supported browsers

/**
 * Creates a Webpack configuration for a specific browser and mode.
 * @param {string} browser - The browser name ('chrome', 'firefox', 'edge', etc.)
 * @param {string} mode - The build mode ('production' or 'development')
 * @returns {object} - The Webpack configuration object
 */
const createBrowserConfig = (browser, mode) => {
  const isProduction = mode === "production";

  return {
    mode: isProduction ? "production" : "development",
    entry: {
      content_style: path.resolve(__dirname, "src/content_style/content_style.ts"),
      options: path.resolve(__dirname, "src/options/options.ts"),
    },
    output: {
      path: path.resolve(__dirname, 'dist', browser),
      filename: "[name]/[name].js",
      clean: true, // Clean the output directory before building
    },
    devtool: isProduction ? false : "source-map", // Enable source maps only in development
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
      }),
      new ForkTsCheckerWebpackPlugin(), // Add type checking plugin
      new CopyPlugin({
        patterns: [
          {
            from: "src",
            globOptions: {
              ignore: ["**/*.ts", "**/*.ejs"], // Exclude TypeScript and EJS files
            },
          },
          {
            from: "src/*.ejs",
            to: ({ absoluteFilename }) => {
              const newFileName = path.basename(absoluteFilename, ".ejs");
              return path.join(newFileName);
            },
            transform: (content) => {
              const data = {
                version: packageJson.version, // Use version from package.json
                browser: browser, // Target browser
              };

              // Render the EJS template
              return ejs.render(content.toString(), data);
            },
          },
        ],
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/i,
          loader: "ts-loader",
          exclude: [/\/node_modules\//],
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
          exclude: [/\/node_modules\//],
        },
      ],
    },
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin(), // Minify JavaScript
        new HtmlMinimizerPlugin({
          minimizerOptions: {
            collapseWhitespace: true,
            removeComments: true,
            conservativeCollapse: false,
          },
        }),
        new CssMinimizerPlugin(), // Minify CSS
        new JsonMinimizerPlugin(), // Minify JSON
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"], // Resolve these extensions
    },
  };
};

/**
 * Webpack export function.
 * @param {object} env - Environment variables
 * @param {object} argv - Command line arguments
 * @returns {Array<object>} - Array of Webpack configuration objects for each browser
 */
module.exports = (env, argv) => {
  const mode = argv.mode || 'development'; // Default to development mode if not specified
  return browsers.map(browser => createBrowserConfig(browser, mode));
};
