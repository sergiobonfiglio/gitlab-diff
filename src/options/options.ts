const gitlabCustomDomain = "#custom-domain";
const gitlabCustomDomainKey = "custom-domain";

async function restoreOptions() {
	const res = await browser.storage.local.get();
	if (gitlabCustomDomainKey in res) {
		const inputEl = document.querySelector(
			gitlabCustomDomain,
		) as HTMLInputElement;
		if (inputEl) {
			inputEl.value = res[gitlabCustomDomainKey];
		}
	}
}
async function registerScript(pattern: string) {
	return browser.runtime.sendMessage({
		pattern: pattern,
	});
}

async function saveOptions(e: Event) {
	e.preventDefault();

	const items: { [key: string]: string } = {};
	items[gitlabCustomDomainKey] = (
		document.querySelector(gitlabCustomDomain) as HTMLInputElement
	).value;
	await browser.storage.local
		.set(items)
		.catch((reason) => console.error(reason));

	await registerScript(items[gitlabCustomDomainKey]);

	const message = document.createElement("div");
	message.innerText = "Saved successfully!";

	document.querySelector("form")?.appendChild(message);
	setTimeout(() => document.querySelector("form")?.removeChild(message), 2000);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form")?.addEventListener("submit", saveOptions);

export interface Options {
	gitlabCustomDomain?: string;
}

export async function getOptions(): Promise<Options> {
	const options: Options = {};
	const res = await browser.storage.local.get();
	if (gitlabCustomDomainKey in res) {
		options.gitlabCustomDomain = res[gitlabCustomDomainKey];
	}

	return options;
}
