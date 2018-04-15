# Technology overview
- Fastify web server
	- HTTPS enabled (with junk cert/key)
	- HTTP/2 enabled
	- HTTP/2 push enabled via [node-fastify-auto-push](https://github.com/google/node-fastify-auto-push)
		- > "It can be thought as a replacement of the [`fastify-static`](https://github.com/fastify/fastify-static) plugin that supports automatic server-push."

# Use
- `npm install`
- `node index.js` (you might need `--expose-http2`?)

# Credits
- https://medium.com/the-node-js-collection/node-js-can-http-2-push-b491894e1bb1
