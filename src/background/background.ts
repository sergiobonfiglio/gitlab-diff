import RegisteredContentScript = browser.contentScripts.RegisteredContentScript;
import { getOptions } from "../options/options";

let registered: RegisteredContentScript | null = null;

async function registerScript(message: { pattern: string }) {
	if (registered) {
		await registered.unregister();
	}

	registered = await browser.contentScripts.register({
		matches: [message.pattern],
		js: [{ file: "content-scripts/content-script.js" }],
		runAt: "document_idle",
	});
}

async function init() {
	const options = await getOptions();
	if (options.gitlabCustomDomain) {
		await registerScript({ pattern: options.gitlabCustomDomain });
	}
}

browser.runtime.onMessage.addListener(registerScript);
init().catch((reason) =>
	console.warn("unable to initialize background script", reason),
);
