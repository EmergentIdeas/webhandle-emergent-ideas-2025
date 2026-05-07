import express5Setup from '@webhandle/express-5'
import listenOnHttpServer from "@webhandle/core/lib/listen-on-http-server.mjs";
import setupTripartiteRenderer from '@webhandle/tripartite-renderer/initialize-webhandle-component.mjs';
import setupPages from '@webhandle/pages-server/initialize-webhandle-component.mjs'
import path from "node:path"
import setupExternalResources from "@webhandle/external-resource-manager/initialize-webhandle-component.mjs"
import setupSessionCookie from "@webhandle/session-cookie/initialize-webhandle-component.mjs"
import setupFlashMessages from "@webhandle/tracker-flash-message/initialize-webhandle-component.mjs"
import mongoDBLoader from "@webhandle/mongo-db-loader/initialize-webhandle-component.mjs"
import userManagementSetup from "@webhandle/user-management/initialize-webhandle-component.mjs"
import setupLogin from "@webhandle/login/initialize-webhandle-component.mjs"
import siteEditorBridgeSetup from "@webhandle/site-editor-bridge/initialize-webhandle-component.mjs"
import setupUserAgentDetection from "@webhandle/user-agent-detection/initialize-webhandle-component.mjs"
import setupDecodePath from './lib/decode-path.mjs';
import menuEditorSetup from "@webhandle/menu-set-editor/initialize-webhandle-component.mjs"
import setupMenuLoader from "@webhandle/menu-loader/initialize-webhandle-component.mjs"
import setupFirefoxImportmapConsolidator from "@webhandle/firefox-importmap-consolidator/initialize-webhandle-component.mjs"

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
	
	let modConfig = webhandle.config['@webhandle/emergent-ideas-2025'] || {}

	
	setupDecodePath(webhandle)

	webhandle.projectRoot = path.resolve(webhandle.projectRoot)

	await setupUserAgentDetection(webhandle)

	listenOnHttpServer(webhandle)
	
	
	if(!modConfig.excludeBasicInfrastructure) {

		await setupTripartiteRenderer(webhandle)

		// We don't need to add the views directory since this is what express does already
		// and will be automatically included as an uncached source of templates
		
		
		await setupFirefoxImportmapConsolidator(webhandle)

		webhandle.addStaticDir('public', {fixedSetOfFiles: false})

		await setupPages(webhandle)
		
		await setupExternalResources(webhandle)
		
		await setupSessionCookie(webhandle)
		
		await setupFlashMessages(webhandle)
		
		await mongoDBLoader(webhandle)

		await setupLogin(webhandle)

		if(!modConfig.excludeManagementTools) {
			await userManagementSetup(webhandle)

			await siteEditorBridgeSetup(webhandle)

			await menuEditorSetup(webhandle)

			await setupMenuLoader(webhandle)
		}
	}

	return webhandle
}
