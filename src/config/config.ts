export const MEASUREMENTS_TABLE = process.env.MEASUREMENTS_TABLE || 'measurements';
export const POINTS_TABLE = process.env.POINTS_TABLE || 'points';
export const DYNAMODB_ENDPOINT = process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000';
export const DYNAMODB_REGION = process.env.DYNAMODB_REGION ? 'local-env' : process.env.DYNAMODB_REGION || 'us-east-1';
export const CALCULATIONS_API = process.env.CALCULATIONS_API || 'http://localhost:3000';
