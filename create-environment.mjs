import express5Setup from '@webhandle/express-5'
import listenOnHttpServer from "@webhandle/core/lib/listen-on-http-server.mjs";
import setupTripartiteRenderer from '@webhandle/tripartite-renderer/setup-tripartite-renderer.mjs';
import setupPagesServerMiddleware from '@webhandle/pages-server'
import path from "node:path"

export default async function createEnvironment() {
	let webhandle = await express5Setup()
	if(!globalThis.webhandle) {
		globalThis.webhandle = webhandle
	}
	webhandle.projectRoot = path.resolve(webhandle.projectRoot)
	listenOnHttpServer(webhandle)
	setupTripartiteRenderer(webhandle)

	let templatesPath = path.resolve(webhandle.projectRoot, './views')
	let publicPath = path.resolve(webhandle.projectRoot, './public')


	// webhandle.app.set('views', templatesPath) // specify the views directory
	webhandle.addTemplateDir(templatesPath)
	webhandle.addStaticDir(publicPath)

	setupPagesServerMiddleware(webhandle)

	return webhandle
}
