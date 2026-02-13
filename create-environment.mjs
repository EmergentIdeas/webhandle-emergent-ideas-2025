import express5Setup from '@webhandle/express-5'
import listenOnHttpServer from "@webhandle/core/lib/listen-on-http-server.mjs";
import setupTripartiteRenderer from '@webhandle/tripartite-renderer/initialize-webhandle-component.mjs';
import setupPages from '@webhandle/pages-server/initialize-webhandle-component.mjs'
import path from "node:path"
import setupExternalResources from "@webhandle/external-resource-manager/initialize-webhandle-component.mjs"
import setupSessionCookie from "@webhandle/session-cookie/initialize-webhandle-component.mjs"
import setupFlashMessages from "@webhandle/tracker-flash-message/initialize-webhandle-component.mjs"
import mongoDBLoader from "@webhandle/mongo-db-loader/initialize-webhandle-component.mjs"

export default async function createEnvironment() {
	let webhandle = await express5Setup()
	if(!globalThis.webhandle) {
		globalThis.webhandle = webhandle
	}
	if(typeof global !== 'undefined') {
		if(!global.webhandle) {
			global.webhandle = webhandle
		}
	}

	webhandle.projectRoot = path.resolve(webhandle.projectRoot)
	listenOnHttpServer(webhandle)
	await setupTripartiteRenderer(webhandle)

	// We don't need to add the views directory since this is what express does already
	// and will be automatically included as an uncached source of templates

	webhandle.addStaticDir('public', {fixedSetOfFiles: false})

	await setupPages(webhandle)
	
	await setupExternalResources(webhandle)
	
	await setupSessionCookie(webhandle)
	
	await setupFlashMessages(webhandle)
	
	await mongoDBLoader(webhandle)

	return webhandle
}
