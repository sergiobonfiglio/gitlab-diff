import {addDiffsResizeHandle} from './mrDiffResizer'
import {addDashedLinetoFileTreeResize} from "./fileTreeHandle";
import {tryUntilTrue} from "./utils";

tryUntilTrue(addDashedLinetoFileTreeResize);

// we need to keep doing this because diff-viewers get lazily loaded
setInterval(addDiffsResizeHandle, 500);
