import u from "node:url"

export default function setupDecodePath(webhandle) {

	// decode the path
	// What's happening here is two things:
	// 1. Node won't let you just set the path, so you have to set the whole url, which does result in the path
	// being changed.
	// 2. Neither node nor express 5 seems to decode the url pathname. These means that pretty much every component
	// would need to. That just seems too wrong. 
	// 
	// I'm sure some component someplace relies on this behavior, so I don't want to code it down too deeply.
	// I do see that express decodes parameters, so I want to make sure we don't mess with those.
	// It's a pretty strange to me that express doesn't do something about this. If you try to add a handler like
	// router.get('/@something, ...)
	// that doesn't work if the url /%40something unless this code is run. So maybe they just don't anticipate
	// uri encoding in the path.
	// However, if there's something which CAN'T exist in a URL, like a space, this won't work.
	webhandle.routers.requestParse.use((req, res, next) => {
		try {
			let url = u.parse(req.url)
			url.pathname = decodeURIComponent(url.pathname)
			req.url = url.format()
		}
		catch(e) { }

		next()
	})	
}