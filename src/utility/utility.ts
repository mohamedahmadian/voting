import 'dotenv/config';

export const getEnv = (name: string, def = ''): string => {
  try {
    const env = process.env[name.toUpperCase()] || def;
    if (!env) {
      throw new Error(
        `${name.toUpperCase()} not found on global environment vars`,
      );
    }
    return env;
  } catch (error) {
    console.log(error);
  }
};

export const availableEnv = {
  LOCAL: 'LOCAL',
  DEVELOPMENT: 'DEVELOPMENT',
  PRODUCTION: 'PRODUCTION',
};

export const currentEnv = () => getEnv('ENV', availableEnv.LOCAL) as any;

export const isLocal = () => currentEnv() === availableEnv.LOCAL;
