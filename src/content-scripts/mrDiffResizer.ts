import { adjustRules, createRules } from "./cssManager";

/**
 * The attribute name used to mark divs that have already been processed.
 * Used to mark diff-viewer containers once we add our changes so that we
 * don't process them again.
 * */
const MARKING_ATTR_NAME = "data-qol";

function markElement(parent: Element): string {
	const uuid = crypto.randomUUID();
	parent.setAttribute(MARKING_ATTR_NAME, uuid);
	return uuid;
}

function addMouseListener(
	triggerElement: HTMLElement,
	container: HTMLElement,
	onChangePerc: (perc: number) => void,
): void {
	let isDragging = false;
	triggerElement.addEventListener("dblclick", () => {
		clearTimeout(mdt);
		isDragging = false;
		onChangePerc(50);
	});

	//use a delay on mousedown to give the user a change to double-click
	let mdt = 0;
	triggerElement.addEventListener("mousedown", (event) => {
		clearTimeout(mdt);
		mdt = setTimeout(() => {
			isDragging = true;
		}, 50);

		// prevent default to avoid text from bein selected
		event.preventDefault();
	});

	container.addEventListener("mousemove", (event) => {
		if (isDragging) {
			onChangePerc(getMouseXperc(event, container));
		}
	});

	container.addEventListener("mouseup", (event) => {
		clearTimeout(mdt);
		if (isDragging) {
			onChangePerc(getMouseXperc(event, container));
		}
		isDragging = false;
	});
}

const MIN_HANDLE_POS = 10;
const MAX_HANDLE_POS = 90;

function getMouseXperc(event: MouseEvent, parent: HTMLElement): number {
	const rect = parent.getBoundingClientRect();
	const x = event.clientX - rect.left; //x position within the element.

	let perc = (x / rect.width) * 100;

	perc = Math.max(MIN_HANDLE_POS, perc);
	perc = Math.min(perc, MAX_HANDLE_POS);

	return perc;
}

function createDiffHandle(): HTMLElement {
	const dashColor = "#1f1e24";
	const handle = document.createElement("div");
	handle.style.position = "absolute";
	handle.style.height = "100%";
	handle.style.width = "6px";
	handle.style.top = "0";
	handle.style.left = "calc(50% - 3px)";
	// handle.style.zIndex = '999';
	handle.style.cursor = "ew-resize";
	handle.style.backgroundImage = `linear-gradient(0deg, ${dashColor}, ${dashColor} 65%, transparent 65%, transparent 100%)`;
	handle.style.backgroundSize = "1px 20px";
	return handle;
}

function addDiffsResizeHandle(): void {
	// get all diff-viewers (with side-by-side diffs) currently in the DOM that are not already marked
	const parents = document.querySelectorAll(`
.diff-viewer:has(.diff-grid):not([${MARKING_ATTR_NAME}]),
.diff-viewer:has(.left-side):not([${MARKING_ATTR_NAME}]) 
`);

	parents.forEach((pElement) => {
		const parent = pElement as HTMLElement;
		if (parent && !parent.hasAttribute(MARKING_ATTR_NAME)) {
			// mark element to avoid doing the init again
			const uuid = markElement(parent);

			// needed for mobile view
			parent.style.position = "relative";

			// add stylesheet
			createRules(MARKING_ATTR_NAME, uuid);
			const handle = createDiffHandle();

			function onPercChange(perc: number) {
				adjustRules(MARKING_ATTR_NAME, uuid, perc);
				handle.style.left = `${perc.toFixed(4)}%`;
			}

			addMouseListener(handle, parent, onPercChange);

			parent.appendChild(handle);

			//calculate initial position
			const filePermissions = document.querySelector(
				`.diff-file:has([data-qol='${uuid}']) .file-header-content > small:last-child`,
			);

			if (filePermissions) {
				// this is either a new file or a deleted one! One side will be empty: let's find out which one.
				const sides = (filePermissions as HTMLElement).innerText.split(" ");
				const left = Number.parseInt(sides[0]);
				if (left === 0) {
					onPercChange(MIN_HANDLE_POS);
				}
				const right = Number.parseInt(sides[sides.length - 1]);
				if (right === 0) {
					onPercChange(MAX_HANDLE_POS);
				}
			}
		}
	});
}

export { addDiffsResizeHandle };
