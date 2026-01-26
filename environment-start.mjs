#! /usr/local/bin/node
import createEnvironment from './create-environment.mjs';
let webhandle = await createEnvironment()
globalThis.webhandle = webhandle

let serverStartingPoint = process.argv[2]
if(serverStartingPoint) {
	if(serverStartingPoint.startsWith('.')) {
		serverStartingPoint = `${process.cwd()}${serverStartingPoint.substring(1)}`
	}
	import(serverStartingPoint).then(mod => {
		if(mod && mod.default) {
			mod.default(webhandle)
		}
	})
}
