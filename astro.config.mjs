// @ts-check
import { defineConfig } from 'astro/config';
import clerk from "@clerk/astro";
import react from "@astrojs/react";
import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  integrations: [clerk(), react()],
  adapter: netlify({
    middlewareMode: 'edge'
  }),
  output: "server"
});