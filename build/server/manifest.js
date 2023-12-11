const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","robots.txt"]),
	mimeTypes: {".png":"image/png",".txt":"text/plain"},
	_: {
		client: {"start":"_app/immutable/entry/start.16a817fb.js","app":"_app/immutable/entry/app.9ef89f44.js","imports":["_app/immutable/entry/start.16a817fb.js","_app/immutable/chunks/scheduler.16cbcee3.js","_app/immutable/chunks/singletons.e988ef62.js","_app/immutable/entry/app.9ef89f44.js","_app/immutable/chunks/scheduler.16cbcee3.js","_app/immutable/chunks/index.cb8f8d94.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./chunks/0-12231f8c.js')),
			__memo(() => import('./chunks/1-96f4aec6.js')),
			__memo(() => import('./chunks/2-1e3a4eda.js'))
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
