const HEADERS = {
	credentials: "include",
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json"
	}
};

const HEADERS_NORMAL = {
	credentials: "include",
	headers: {
		"Content-Type": "application/text",
		Accept: "application/json"
	}
};

const decoder = new TextDecoder("utf-8");

const cleanURL = url => {
	url = url.replace(/^\//, ""); // get rid of extra slash
	if (url && !url.startsWith("http")) url = URL_PREFIX + url;
	return url;
};

const URL_PREFIX = "/api/";

const fetch = global.fetch || window.fetch;

/**
 * Always returns a promise, which returns { err, data }
 */
const DB = {
	fetch: (url, method = "GET", headers, cb) => {
		headers = setHeader(method, headers);
		return fetch(cleanURL(url), headers)
			.then(r => getResponse(r, cb, url))
			.catch(handleError);
	},
	create: function(url, payload) {
		return this.fetch(url, "POST", { body: payload });
	},
	get: function(url, id) {
		if (id !== undefined) return this.fetch(url + "/" + encodeURIComponent(id));
		else return this.fetch(url, undefined, undefined);
	},
	getStreamed: function(url, cb) {
		return this.fetch(encodeURI(url), "GET", HEADERS_NORMAL, cb);
	},
	set: function(url, id, payload) {
		return this.fetch(url + "/" + encodeURIComponent(id), "PUT", { body: payload });
	},
	delete: function(url, id) {
		return this.fetch(url + "/" + encodeURIComponent(id), "DELETE", undefined);
	}
};

function setHeader(method, headers) {
	if (!headers && !method) return HEADERS;

	if (headers) {
		if (headers.body instanceof FormData) headers.body = formDataTOJson(headers.body);
		headers.body = headers.body instanceof Object ? JSON.stringify(headers.body) : headers.body;
	}

	return Object.assign({}, HEADERS, { method: method || "GET" }, headers);
}

function formDataTOJson(formData) {
	let jsonObject = {};

	let key, value;
	for ([key, value] of formData.entries()) {
		jsonObject[key] = value;
	}
	return jsonObject;
}

function handleError(error) {
	const newErr = { ...error, title: error.name };

	// Component unmounted
	if (error.name === "AbortError") return;

	// ERR_CONNECTION_REFUSED
	if (error.message === "Failed to fetch") {
		newErr.title =
			"We're having trouble communicating with the server right now. Please check your internet connection.";
	}

	return [error];
}

async function getResponse(response, cb, url) {
	if (!response) {
		return { errors: [{ title: "No response from server" }] };
	}

	let json = await parseResponse(response, cb);

	// create an errors object if there is not one and we errored
	if ((!json || !json.errors) && (response.status < 200 || response.status > 299)) {
		return { errors: [{ title: response.status }] };
	}

	if (!json) {
		return { errors: [{ title: "No response from server" }] };
	}

	return json;
}

function decodeChunk(queue = "", value) {
	let lines = decoder.decode(value).split("\n");

	lines = lines
		.map(l => {
			try {
				l = JSON.parse(queue + l);
				queue = "";
				return l;
			} catch (e) {
				// incomplete, push it to the queue
				queue += l;
				return false;
			}
		})
		.filter(l => l);

	return { lines, queue };
}

async function parseResponse(response, cb = () => {}) {
	var data = {};
	var contentType = response.headers.get("content-type");

	if (contentType && contentType.includes("json")) {
		data = await response.json();
	} else {
		const reader = response.body.getReader();
		let queue = "";
		reader.read().then(function processChunk({ value, done }) {
			if (done) {
				return;
			}
			const { lines, queue: newQueue } = decodeChunk(queue, value);
			lines.forEach(cb);
			queue = newQueue;

			// do it again
			return reader.read().then(processChunk);
		});
	}
	return data;
}
export default DB;
