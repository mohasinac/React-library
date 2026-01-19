// vite.config.ts
import react from "file:///D:/proj/letitrip.in/node_modules/@vitejs/plugin-react/dist/index.js";
import { copyFileSync, mkdirSync, readdirSync } from "fs";
import { resolve } from "path";
import { defineConfig } from "file:///D:/proj/letitrip.in/node_modules/vite/dist/node/index.js";
import dts from "file:///D:/proj/letitrip.in/node_modules/vite-plugin-dts/dist/index.mjs";
var __vite_injected_original_dirname = "D:\\proj\\letitrip.in\\react-library";
function copyTokens() {
  return {
    name: "copy-tokens",
    closeBundle() {
      const tokensDir = resolve(__vite_injected_original_dirname, "src/styles/tokens");
      const distTokensDir = resolve(__vite_injected_original_dirname, "dist/styles/tokens");
      mkdirSync(distTokensDir, { recursive: true });
      const files = readdirSync(tokensDir);
      files.forEach((file) => {
        if (file.endsWith(".css")) {
          copyFileSync(resolve(tokensDir, file), resolve(distTokensDir, file));
        }
      });
      console.log(
        `\u2713 Copied ${files.filter((f) => f.endsWith(".css")).length} CSS token files to dist/styles/tokens`
      );
    }
  };
}
var vite_config_default = defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ["src/**/*"],
      exclude: ["src/**/*.stories.tsx", "src/**/*.test.tsx"]
    }),
    copyTokens()
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__vite_injected_original_dirname, "src/index.ts"),
        "utils/index": resolve(__vite_injected_original_dirname, "src/utils/index.ts"),
        "components/index": resolve(__vite_injected_original_dirname, "src/components/index.ts"),
        "hooks/index": resolve(__vite_injected_original_dirname, "src/hooks/index.ts"),
        "styles/index": resolve(__vite_injected_original_dirname, "src/styles/index.ts"),
        "types/index": resolve(__vite_injected_original_dirname, "src/types/index.ts")
      },
      name: "LetitripReactLibrary",
      formats: ["es", "cjs"]
    },
    rollupOptions: {
      // External dependencies that should not be bundled
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "date-fns",
        "clsx",
        "tailwind-merge",
        "libphonenumber-js"
      ],
      output: {
        banner: (chunk) => {
          return '"use client";';
        },
        // Global variables for UMD/IIFE builds
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
          "date-fns": "dateFns",
          clsx: "clsx",
          "tailwind-merge": "tailwindMerge",
          "libphonenumber-js": "libphonenumberJs"
        },
        // Optimize chunk splitting for better tree-shaking
        manualChunks: void 0,
        // Let Rollup decide optimal chunks
        // Preserve module structure for better tree-shaking
        preserveModules: false,
        // Use compact output for smaller bundle size
        compact: true,
        // Code splitting optimization
        chunkFileNames: (chunkInfo) => {
          const name = chunkInfo.name;
          if (name.includes("node_modules")) {
            return "vendor/[name]-[hash].js";
          }
          if (name.includes("components")) {
            return "chunks/components/[name]-[hash].js";
          }
          if (name.includes("utils")) {
            return "chunks/utils/[name]-[hash].js";
          }
          if (name.includes("hooks")) {
            return "chunks/hooks/[name]-[hash].js";
          }
          return "chunks/[name]-[hash].js";
        }
      }
    },
    // Minification and optimization
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: false,
        // Keep console for debugging
        drop_debugger: true,
        // Remove debugger statements
        pure_funcs: ["console.debug"],
        // Remove console.debug calls
        passes: 2
        // Run compression twice for better results
      },
      mangle: {
        safari10: true
        // Safari 10 compatibility
      },
      format: {
        comments: false,
        // Remove comments
        ecma: 2020
        // Target ES2020
      }
    },
    // Source map generation
    sourcemap: true,
    // Target modern browsers for smaller bundle
    target: "es2020",
    // Optimize CSS
    cssCodeSplit: true,
    cssMinify: true,
    // Report bundle size
    reportCompressedSize: true,
    // Chunk size warning limit (500kb)
    chunkSizeWarningLimit: 500
  },
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "./src")
    }
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ["react", "react-dom"],
    exclude: ["date-fns", "libphonenumber-js"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxwcm9qXFxcXGxldGl0cmlwLmluXFxcXHJlYWN0LWxpYnJhcnlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXHByb2pcXFxcbGV0aXRyaXAuaW5cXFxccmVhY3QtbGlicmFyeVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovcHJvai9sZXRpdHJpcC5pbi9yZWFjdC1saWJyYXJ5L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xyXG5pbXBvcnQgeyBjb3B5RmlsZVN5bmMsIG1rZGlyU3luYywgcmVhZGRpclN5bmMgfSBmcm9tIFwiZnNcIjtcclxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XHJcbmltcG9ydCBkdHMgZnJvbSBcInZpdGUtcGx1Z2luLWR0c1wiO1xyXG5cclxuLy8gUGx1Z2luIHRvIGNvcHkgQ1NTIHRva2VuIGZpbGVzIHRvIGRpc3RcclxuZnVuY3Rpb24gY29weVRva2VucygpIHtcclxuICByZXR1cm4ge1xyXG4gICAgbmFtZTogXCJjb3B5LXRva2Vuc1wiLFxyXG4gICAgY2xvc2VCdW5kbGUoKSB7XHJcbiAgICAgIGNvbnN0IHRva2Vuc0RpciA9IHJlc29sdmUoX19kaXJuYW1lLCBcInNyYy9zdHlsZXMvdG9rZW5zXCIpO1xyXG4gICAgICBjb25zdCBkaXN0VG9rZW5zRGlyID0gcmVzb2x2ZShfX2Rpcm5hbWUsIFwiZGlzdC9zdHlsZXMvdG9rZW5zXCIpO1xyXG5cclxuICAgICAgLy8gQ3JlYXRlIGRpc3Qvc3R5bGVzL3Rva2VucyBkaXJlY3RvcnlcclxuICAgICAgbWtkaXJTeW5jKGRpc3RUb2tlbnNEaXIsIHsgcmVjdXJzaXZlOiB0cnVlIH0pO1xyXG5cclxuICAgICAgLy8gQ29weSBhbGwgQ1NTIGZpbGVzXHJcbiAgICAgIGNvbnN0IGZpbGVzID0gcmVhZGRpclN5bmModG9rZW5zRGlyKTtcclxuICAgICAgZmlsZXMuZm9yRWFjaCgoZmlsZSkgPT4ge1xyXG4gICAgICAgIGlmIChmaWxlLmVuZHNXaXRoKFwiLmNzc1wiKSkge1xyXG4gICAgICAgICAgY29weUZpbGVTeW5jKHJlc29sdmUodG9rZW5zRGlyLCBmaWxlKSwgcmVzb2x2ZShkaXN0VG9rZW5zRGlyLCBmaWxlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGNvbnNvbGUubG9nKFxyXG4gICAgICAgIGBcdTI3MTMgQ29waWVkICR7XHJcbiAgICAgICAgICBmaWxlcy5maWx0ZXIoKGYpID0+IGYuZW5kc1dpdGgoXCIuY3NzXCIpKS5sZW5ndGhcclxuICAgICAgICB9IENTUyB0b2tlbiBmaWxlcyB0byBkaXN0L3N0eWxlcy90b2tlbnNgLFxyXG4gICAgICApO1xyXG4gICAgfSxcclxuICB9O1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtcclxuICAgIHJlYWN0KCksXHJcbiAgICBkdHMoe1xyXG4gICAgICBpbnNlcnRUeXBlc0VudHJ5OiB0cnVlLFxyXG4gICAgICBpbmNsdWRlOiBbXCJzcmMvKiovKlwiXSxcclxuICAgICAgZXhjbHVkZTogW1wic3JjLyoqLyouc3Rvcmllcy50c3hcIiwgXCJzcmMvKiovKi50ZXN0LnRzeFwiXSxcclxuICAgIH0pLFxyXG4gICAgY29weVRva2VucygpLFxyXG4gIF0sXHJcbiAgYnVpbGQ6IHtcclxuICAgIGxpYjoge1xyXG4gICAgICBlbnRyeToge1xyXG4gICAgICAgIGluZGV4OiByZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvaW5kZXgudHNcIiksXHJcbiAgICAgICAgXCJ1dGlscy9pbmRleFwiOiByZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvdXRpbHMvaW5kZXgudHNcIiksXHJcbiAgICAgICAgXCJjb21wb25lbnRzL2luZGV4XCI6IHJlc29sdmUoX19kaXJuYW1lLCBcInNyYy9jb21wb25lbnRzL2luZGV4LnRzXCIpLFxyXG4gICAgICAgIFwiaG9va3MvaW5kZXhcIjogcmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL2hvb2tzL2luZGV4LnRzXCIpLFxyXG4gICAgICAgIFwic3R5bGVzL2luZGV4XCI6IHJlc29sdmUoX19kaXJuYW1lLCBcInNyYy9zdHlsZXMvaW5kZXgudHNcIiksXHJcbiAgICAgICAgXCJ0eXBlcy9pbmRleFwiOiByZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvdHlwZXMvaW5kZXgudHNcIiksXHJcbiAgICAgIH0sXHJcbiAgICAgIG5hbWU6IFwiTGV0aXRyaXBSZWFjdExpYnJhcnlcIixcclxuICAgICAgZm9ybWF0czogW1wiZXNcIiwgXCJjanNcIl0sXHJcbiAgICB9LFxyXG4gICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICAvLyBFeHRlcm5hbCBkZXBlbmRlbmNpZXMgdGhhdCBzaG91bGQgbm90IGJlIGJ1bmRsZWRcclxuICAgICAgZXh0ZXJuYWw6IFtcclxuICAgICAgICBcInJlYWN0XCIsXHJcbiAgICAgICAgXCJyZWFjdC1kb21cIixcclxuICAgICAgICBcInJlYWN0L2pzeC1ydW50aW1lXCIsXHJcbiAgICAgICAgXCJkYXRlLWZuc1wiLFxyXG4gICAgICAgIFwiY2xzeFwiLFxyXG4gICAgICAgIFwidGFpbHdpbmQtbWVyZ2VcIixcclxuICAgICAgICBcImxpYnBob25lbnVtYmVyLWpzXCIsXHJcbiAgICAgIF0sXHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIGJhbm5lcjogKGNodW5rKSA9PiB7XHJcbiAgICAgICAgICAvLyBBZGQgXCJ1c2UgY2xpZW50XCIgZGlyZWN0aXZlIHRvIGFsbCBjaHVua3NcclxuICAgICAgICAgIHJldHVybiAnXCJ1c2UgY2xpZW50XCI7JztcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIEdsb2JhbCB2YXJpYWJsZXMgZm9yIFVNRC9JSUZFIGJ1aWxkc1xyXG4gICAgICAgIGdsb2JhbHM6IHtcclxuICAgICAgICAgIHJlYWN0OiBcIlJlYWN0XCIsXHJcbiAgICAgICAgICBcInJlYWN0LWRvbVwiOiBcIlJlYWN0RE9NXCIsXHJcbiAgICAgICAgICBcInJlYWN0L2pzeC1ydW50aW1lXCI6IFwianN4UnVudGltZVwiLFxyXG4gICAgICAgICAgXCJkYXRlLWZuc1wiOiBcImRhdGVGbnNcIixcclxuICAgICAgICAgIGNsc3g6IFwiY2xzeFwiLFxyXG4gICAgICAgICAgXCJ0YWlsd2luZC1tZXJnZVwiOiBcInRhaWx3aW5kTWVyZ2VcIixcclxuICAgICAgICAgIFwibGlicGhvbmVudW1iZXItanNcIjogXCJsaWJwaG9uZW51bWJlckpzXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBPcHRpbWl6ZSBjaHVuayBzcGxpdHRpbmcgZm9yIGJldHRlciB0cmVlLXNoYWtpbmdcclxuICAgICAgICBtYW51YWxDaHVua3M6IHVuZGVmaW5lZCwgLy8gTGV0IFJvbGx1cCBkZWNpZGUgb3B0aW1hbCBjaHVua3NcclxuICAgICAgICAvLyBQcmVzZXJ2ZSBtb2R1bGUgc3RydWN0dXJlIGZvciBiZXR0ZXIgdHJlZS1zaGFraW5nXHJcbiAgICAgICAgcHJlc2VydmVNb2R1bGVzOiBmYWxzZSxcclxuICAgICAgICAvLyBVc2UgY29tcGFjdCBvdXRwdXQgZm9yIHNtYWxsZXIgYnVuZGxlIHNpemVcclxuICAgICAgICBjb21wYWN0OiB0cnVlLFxyXG4gICAgICAgIC8vIENvZGUgc3BsaXR0aW5nIG9wdGltaXphdGlvblxyXG4gICAgICAgIGNodW5rRmlsZU5hbWVzOiAoY2h1bmtJbmZvKSA9PiB7XHJcbiAgICAgICAgICAvLyBHcm91cCByZWxhdGVkIGNodW5rcyB0b2dldGhlclxyXG4gICAgICAgICAgY29uc3QgbmFtZSA9IGNodW5rSW5mby5uYW1lO1xyXG4gICAgICAgICAgaWYgKG5hbWUuaW5jbHVkZXMoXCJub2RlX21vZHVsZXNcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwidmVuZG9yL1tuYW1lXS1baGFzaF0uanNcIjtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChuYW1lLmluY2x1ZGVzKFwiY29tcG9uZW50c1wiKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJjaHVua3MvY29tcG9uZW50cy9bbmFtZV0tW2hhc2hdLmpzXCI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAobmFtZS5pbmNsdWRlcyhcInV0aWxzXCIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcImNodW5rcy91dGlscy9bbmFtZV0tW2hhc2hdLmpzXCI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAobmFtZS5pbmNsdWRlcyhcImhvb2tzXCIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcImNodW5rcy9ob29rcy9bbmFtZV0tW2hhc2hdLmpzXCI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gXCJjaHVua3MvW25hbWVdLVtoYXNoXS5qc1wiO1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgLy8gTWluaWZpY2F0aW9uIGFuZCBvcHRpbWl6YXRpb25cclxuICAgIG1pbmlmeTogXCJ0ZXJzZXJcIixcclxuICAgIHRlcnNlck9wdGlvbnM6IHtcclxuICAgICAgY29tcHJlc3M6IHtcclxuICAgICAgICBkcm9wX2NvbnNvbGU6IGZhbHNlLCAvLyBLZWVwIGNvbnNvbGUgZm9yIGRlYnVnZ2luZ1xyXG4gICAgICAgIGRyb3BfZGVidWdnZXI6IHRydWUsIC8vIFJlbW92ZSBkZWJ1Z2dlciBzdGF0ZW1lbnRzXHJcbiAgICAgICAgcHVyZV9mdW5jczogW1wiY29uc29sZS5kZWJ1Z1wiXSwgLy8gUmVtb3ZlIGNvbnNvbGUuZGVidWcgY2FsbHNcclxuICAgICAgICBwYXNzZXM6IDIsIC8vIFJ1biBjb21wcmVzc2lvbiB0d2ljZSBmb3IgYmV0dGVyIHJlc3VsdHNcclxuICAgICAgfSxcclxuICAgICAgbWFuZ2xlOiB7XHJcbiAgICAgICAgc2FmYXJpMTA6IHRydWUsIC8vIFNhZmFyaSAxMCBjb21wYXRpYmlsaXR5XHJcbiAgICAgIH0sXHJcbiAgICAgIGZvcm1hdDoge1xyXG4gICAgICAgIGNvbW1lbnRzOiBmYWxzZSwgLy8gUmVtb3ZlIGNvbW1lbnRzXHJcbiAgICAgICAgZWNtYTogMjAyMCwgLy8gVGFyZ2V0IEVTMjAyMFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIC8vIFNvdXJjZSBtYXAgZ2VuZXJhdGlvblxyXG4gICAgc291cmNlbWFwOiB0cnVlLFxyXG4gICAgLy8gVGFyZ2V0IG1vZGVybiBicm93c2VycyBmb3Igc21hbGxlciBidW5kbGVcclxuICAgIHRhcmdldDogXCJlczIwMjBcIixcclxuICAgIC8vIE9wdGltaXplIENTU1xyXG4gICAgY3NzQ29kZVNwbGl0OiB0cnVlLFxyXG4gICAgY3NzTWluaWZ5OiB0cnVlLFxyXG4gICAgLy8gUmVwb3J0IGJ1bmRsZSBzaXplXHJcbiAgICByZXBvcnRDb21wcmVzc2VkU2l6ZTogdHJ1ZSxcclxuICAgIC8vIENodW5rIHNpemUgd2FybmluZyBsaW1pdCAoNTAwa2IpXHJcbiAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDUwMCxcclxuICB9LFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgIFwiQFwiOiByZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcclxuICAgIH0sXHJcbiAgfSxcclxuICAvLyBPcHRpbWl6ZSBkZXBlbmRlbmNpZXNcclxuICBvcHRpbWl6ZURlcHM6IHtcclxuICAgIGluY2x1ZGU6IFtcInJlYWN0XCIsIFwicmVhY3QtZG9tXCJdLFxyXG4gICAgZXhjbHVkZTogW1wiZGF0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
