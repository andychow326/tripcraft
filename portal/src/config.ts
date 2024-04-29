export const AppConfig: {
  api: { endpoint: string };
} = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...(window as any).appConfig,
};
