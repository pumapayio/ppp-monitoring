export default () => ({
  /*
  |--------------------------------------------------------------------------
  | Mail Configurations
  |--------------------------------------------------------------------------
  |
  | In our case we decided to use the GMail SMTP Server. Just add your credentials
  | below or in the .env file.
  |
  */

  host: process.env.MAIL_HOST || "mail.pumapay.io",
  port: parseInt(process.env.MAIL_PORT, 10) || 465,
  from: process.env.MAIL_FROM || '"Noreply" <noreply@pumapay.io>',
  username: process.env.MAIL_USERNAME,
  password: process.env.MAIL_PASSWORD,
})
