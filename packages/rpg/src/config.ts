const config = {
  timeSpeed: 1,
};

export const setConfig = (opts: Partial<typeof config>) => {
  Object.assign(config, opts);
};

export default config;
