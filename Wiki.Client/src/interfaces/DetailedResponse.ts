export interface DetailedResponse<T> {
  success: boolean;
  errorMessages: string[];
  data: T | null;
}
