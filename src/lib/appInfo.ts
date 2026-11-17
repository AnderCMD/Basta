import pkg from '../../package.json';

/** Versión única de la app: viene de package.json (también la usa app.config.ts). */
export const APP_VERSION: string = pkg.version;
export const APP_NAME = 'Basta';
export const REPO_URL = 'https://github.com/AnderCMD/Basta';

/** Autor del proyecto. */
export const AUTHOR = {
  name: 'AnderCMD',
  role: 'Ingeniero en Software · Full Stack Developer',
  portfolio: 'https://www.andercmd.dev',
  github: 'https://github.com/AnderCMD',
  logo: require('../../assets/andercmd/logo-blanco.png'),
} as const;
