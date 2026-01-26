#! /usr/local/bin/node
import createEnvironment from './create-environment.mjs';
let webhandle = await createEnvironment()

let serverStartingPoint = process.argv[2]
if(serverStartingPoint) {
	import(serverStartingPoint).then(mod => {
		if(mod && mod.default) {
			mod.default(webhandle)
		}
	})
}