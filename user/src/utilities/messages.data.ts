function firstLatterUppercase(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function notEmpty(field: string): string {
  return `${firstLatterUppercase(field)} can not be empty!`;
}

export function minLength(field: string, length: number): string {
  return `${firstLatterUppercase(
    field,
  )} must be at least ${length} character long!`;
}

export function maxLength(field: string, length: number): string {
  return `${firstLatterUppercase(field)} must be max ${length} character long!`;
}

export function notValid(field: string, value?: string): string {
  return value
    ? `${value} is not a valid ${firstLatterUppercase(field)}`
    : `${firstLatterUppercase(field)} is not valid!`;
}

export enum ERROR_MESSAGES {
  NOT_AUTHORIZED = 'NOT_AUTHORIZED',
  UPDATE_RPT_ERROR = 'UPDATE_RPT_ERROR',
  UPDATE_USER_ERROR = 'UPDATE_USER_ERROR',
  CHANGE_PASSWORD_REQUEST_ERROR = 'CHANGE_PASSWORD_REQUEST_ERROR',
  CHANGE_PASSWORD_ERROR = 'CHANGE_PASSWORD_ERROR',
  BAN_USER_ERROR = 'BAN_USER_ERROR',
  GRANT_ADMIN_ERROR = 'GRANT_ADMIN_ERROR',
  TAKE_ADMIN_ERROR = 'TAKE_ADMIN_ERROR',
}

export enum SUCCESS_MESSAGES {
  UPDATE_SUCCESSFUL = 'UPDATED_SUCCESSFULLY',
  PASSWORD_CHANGED = 'PASSWORD_CHANGED_SUCCESSFULLY',
  USER_BANNED = 'USER_BANNED_SUCCESSFULLY',
  GRANT_ADMIN = 'ADMIN_ROLE_GRANTED',
  TAKE_ADMIN = 'ADMIN_ROLE_HAS_TAKEN',
}
