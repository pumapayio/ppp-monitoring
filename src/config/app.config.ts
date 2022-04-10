export default () => ({
  /*
  |--------------------------------------------------------------------------
  | Application Meta Data
  |--------------------------------------------------------------------------
  |
  | This values are defined in the package.json.
  |
  */
  name: require("../../package.json").name,
  title: require("../../package.json").title,
  description: require("../../package.json").description,
  version: require("../../package.json").version,

  /*
  |--------------------------------------------------------------------------
  | App URL
  |--------------------------------------------------------------------------
  |
  | This value defines the url to our web client.
  |
  */
  appUrl:
    process.env.APP_URL ||
    `http://localhost:${parseInt(process.env.PORT, 10) || 3333}`,

  /*
  |--------------------------------------------------------------------------
  | Application Port
  |--------------------------------------------------------------------------
  |
  | This value define on witch port the application is available. Default is
  | the standard port 8080
  |
  */

  port: parseInt(process.env.PORT, 10) || 3333,

  /*
  |--------------------------------------------------------------------------
  | Client URL
  |--------------------------------------------------------------------------
  |
  | This value defines the url to our web client.
  |
  */
  clientUrl: process.env.CLIENT_URL || "http://localhost:8080/tournament",
})
