const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "demo/_app",
	assets: new Set(["favicon.png","robots.txt"]),
	mimeTypes: {".png":"image/png",".txt":"text/plain"},
	_: {
		client: {"start":"_app/immutable/entry/start.6488427f.js","app":"_app/immutable/entry/app.88182523.js","imports":["_app/immutable/entry/start.6488427f.js","_app/immutable/chunks/scheduler.16cbcee3.js","_app/immutable/chunks/singletons.5c32fdbe.js","_app/immutable/entry/app.88182523.js","_app/immutable/chunks/scheduler.16cbcee3.js","_app/immutable/chunks/index.cb8f8d94.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./chunks/0-1326349b.js')),
			__memo(() => import('./chunks/1-aef482a6.js')),
			__memo(() => import('./chunks/2-54907ff4.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/api/digital_output/[id]/[value]",
				pattern: /^\/api\/digital_output\/([^/]+?)\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false},{"name":"value","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-1b27e89d.js'))
			},
			{
				id: "/api/sensor",
				pattern: /^\/api\/sensor\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-c7124bc7.js'))
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();

const prerendered = new Set([]);

export { manifest, prerendered };
//# sourceMappingURL=manifest.js.map
