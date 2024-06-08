import RegisteredContentScript = browser.contentScripts.RegisteredContentScript;

let registered: RegisteredContentScript | null = null;

async function registerScript(message: { pattern: string }) {

    if (registered) {
        await registered.unregister();
    }

    registered = await browser.contentScripts.register({
        matches: [message.pattern],
        js: [{file: "content-scripts/content-script.js"}],
        runAt: "document_idle"
    });

}

browser.runtime.onMessage.addListener(registerScript);