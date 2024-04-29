export interface ApiError {
  detail: {
    code: string;
    description: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    detail: any;
  };
}
