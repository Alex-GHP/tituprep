import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "jsdom",
		include: ["__tests__/**/*.test.{ts,tsx}"],
		exclude: ["node_modules", ".pnpm-store", ".next"],
		globals: true,
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "."),
		},
	},
});
