import brevo from '@getbrevo/brevo';
import dotenv from 'dotenv';
dotenv.config();

export const apiInstance = new brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.APIKEY
);
