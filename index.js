const fastify = require('fastify');
const fastifyAutoPush = require('fastify-auto-push');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const fsReadFile = promisify(fs.readFile);

const STATIC_DIR = path.join(__dirname, 'static');
const CERTS_DIR = path.join(__dirname, 'certs');
const PORT = 8080;

const { description, version } = require('./package.json');

async function createServerOptions() {
	const readCertFile = (filename) => fsReadFile(path.join(CERTS_DIR, filename));

	const [key, cert] = await Promise.all([
		readCertFile('server.key'),
		readCertFile('server.crt'),
	]);

	return {
		key,
		cert,
	};
}

async function main() {
	const { key, cert } = await createServerOptions();

	const app = fastify({
		http2: true,
		https: { key, cert },
	});

	// AutoPush should be registered as the first in the middleware chain.
	app.register(fastifyAutoPush.staticServe, {
		root: STATIC_DIR,
	});

	app.route({
		method: 'GET',
		url: '/about',
		schema: {
			response: {
				200: {
					type: 'object',
					properties: {
						version: { type: 'string' },
						description: { type: 'string' },
					},
				},
			},
		},
		handler: async (request, reply) => {
			reply.type('application/json').code(200)

			return {
				version,
				description,
			};
		},
	});

	await app.listen(PORT);
	console.log(`Listening on port ${PORT}`);
}

main().catch((err) => {
	console.error(err);
});
