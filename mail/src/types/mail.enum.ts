export enum MailType {
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  CONFIRMATION = 'CONFIRMATION',
}

export enum Patterns {
  FORGOT_PASSWORD = 'SEND_FORGOT_PASSWORD_MAIL',
  SEND_CONFIRMATION = 'SEND_CONFIRMATION_MAIL',
}

export enum Template {
  FORGOT_PASSWORD = './forgot-password',
  CONFIRMATION = './verify-email',
}

export enum Subject {
  FORGOT_PASSWORD = 'Password Change Request',
  CONFIRMATION = 'Welcome to our app!',
}
