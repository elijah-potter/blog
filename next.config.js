module.exports = {
	images: {
		unoptimized: true,
	},
	async redirects() {
		return [
			{
				source: "/blog",
				destination: "/articles",
				permanent: true,
			},
			{
				source: "/articles/on_iteration_and_lean_thinking",
				destination: "/articles/a_case_for_procrastination",
				permanent: true,
			},
			{
				source: "/renderer",
				destination: "/articles/building_a_software_render_engine_from_scratch",
				permanent: true,
			},
			{
				source: "/markov",
				destination: "/articles/markov_chains_are_the_original_language_models",
				permanent: true,
			},
			{
				source: "/articles/the_books_i_read_since_april_2025",
				destination: "/articles/the_books_i_have_read_since_april_2025",
				permanent: true,
			},
		];
	},
	webpack: (config, options) => {
		config.experiments.asyncWebAssembly = true;

		// TODO: Remove this workaround for Next.js WebAssembly bug
		if (options.isServer) {
			config.output.webassemblyModuleFilename =
				"./../static/wasm/[modulehash].wasm";
		} else {
			config.output.webassemblyModuleFilename = "static/wasm/[modulehash].wasm";
		}

		return config;
	},
};
