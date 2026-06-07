//Error contains - name,message,stack
export interface CustomError extends Error {
  statusCode?: number;
  code?: number;
  errors?: any;
}

export type ReminderPayload = {
  subscriptionId: string;
};