/**
 * Adds a dashed line to the file tree resize handle to make it more visible.
 */
function addDashedLinetoFileTreeResize(): boolean {
    const treeHandle = document.querySelector('.diff-tree-list > .drag-handle') as HTMLElement;

    if (treeHandle) {
        treeHandle.style.backgroundImage = 'linear-gradient(0deg, #333238, #333238 65%, transparent 65%, transparent 100%)'
        treeHandle.style.backgroundSize = '1px 20px'
        return true
    }
    return false
}

export {addDashedLinetoFileTreeResize}