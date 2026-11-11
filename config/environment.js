import dotenv from 'dotenv';

const VALID_ENVIRONMENTS = ['development', 'qa'];

export const environment = process.env.NODE_ENV;

if (!VALID_ENVIRONMENTS.includes(environment)) {
	throw new Error(
		`NODE_ENV must be one of: ${VALID_ENVIRONMENTS.join(', ')}. Use "npm run dev" or "npm run qa".`,
	);
}

dotenv.config({path: `.env.${environment}`});

export const port = Number(process.env.PORT) || 8080;

export const databaseConfig = {
	dialect: process.env.DB_DIALECT,
	storage: process.env.DB_STORAGE,
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT) || undefined,
	database: process.env.DB_NAME,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
};
