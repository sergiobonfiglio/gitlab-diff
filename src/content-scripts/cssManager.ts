const CSS_ID = 'gitlab-qol';

let CSS_STYLE_SHEET: CSSStyleSheet | undefined;

function isElement(x: Element | ProcessingInstruction | null): x is Element {
    return x !== null && 'tagName' in x;
}

const mrViewSelector = (attrName: string, uuid: string): string => `[${attrName}="${uuid}"] > .diff-grid .diff-tr`

const commitViewLeftSelector = (attrName: string, uuid: string): string => `[${attrName}="${uuid}"] td.left-side`
const commitViewRightSelector = (attrName: string, uuid: string): string => `[${attrName}="${uuid}"] td.right-side`


function createRules(attrName: string, uuid: string) {
    const style = ensureCssSheet();
    style.insertRule(`
        /* for merge request view*/
        ${mrViewSelector(attrName, uuid)} {
            grid-template-columns: 1fr 1fr;
        }`);

    // for some reason the commit view is implemented differently :(
    style.insertRule(`
        /* for commit view left side*/
        ${commitViewLeftSelector(attrName, uuid)} {
            width: 46% !important;
        }`);
    style.insertRule(`
        /* for commit view right side */
        ${commitViewRightSelector(attrName, uuid)} {
            width: 46% !important;
        }`);


}

function adjustRules(attrName: string, uuid: string, perc: number) {
    const styleSheet = ensureCssSheet();

    const mrSelector = mrViewSelector(attrName, uuid);
    const commitLeftSelector = commitViewLeftSelector(attrName, uuid);
    const commitRightSelector = commitViewRightSelector(attrName, uuid);
    for (let cssRulesKey in styleSheet.cssRules) {
        const rule = styleSheet.cssRules[cssRulesKey];
        if (isCSSStyleRule(rule)) {
            if (rule.selectorText === mrSelector) {
                rule.style.gridTemplateColumns = `${perc.toFixed(4)}% auto`;
            } else if (rule.selectorText === commitLeftSelector) {
                // apparently setProperty is the only way to set important
                rule.style.setProperty('width', `${(perc - 4).toFixed(4)}%`, 'important');
            } else if (rule.selectorText === commitRightSelector) {
                rule.style.setProperty('width', `${(96 - perc).toFixed(4)}%`, 'important');
            }
        }
    }

}


function ensureCssSheet(): CSSStyleSheet {
    if (CSS_STYLE_SHEET !== undefined) {
        return CSS_STYLE_SHEET
    }

    const found = document.getElementById(CSS_ID) as Element | null;
    if (!found) {
        const head = document.head;
        const style = document.createElement('style');
        style.id = CSS_ID;
        style.innerHTML = `
            .tooltip-wrapper.add-diff-note {
                margin-left: 0 !important;
            }`;
        head.appendChild(style);
    }
    CSS_STYLE_SHEET = Array.from(document.styleSheets)
        .find((ss) =>
            isElement(ss.ownerNode) &&
            ss.ownerNode.tagName === "STYLE" &&
            ss.ownerNode.id === CSS_ID
        ) as CSSStyleSheet;
    return CSS_STYLE_SHEET
}

function isCSSStyleRule(x: CSSRule): x is CSSStyleRule {
    return typeof x === 'object' && 'style' in x;
}

export {adjustRules, createRules};
