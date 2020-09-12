import awsServerlessExpress from 'aws-serverless-express';
import app from './app'
const binaryMimeTypes = [
	'application/octet-stream',
	'font/eot',
	'font/opentype',
	'font/otf',
	'image/jpeg',
	'image/png',
	'image/svg+xml'
]
const server = awsServerlessExpress.createServer(app, null, binaryMimeTypes);
export default (event:any, context:any) => awsServerlessExpress.proxy(server, event, context)
exports.handler = (event:any, context:any) => awsServerlessExpress.proxy(server, event, context)
