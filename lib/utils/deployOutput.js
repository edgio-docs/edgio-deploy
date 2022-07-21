"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BUILD_COMPLETE_RE = /^(?:\*|\s)+Deployment Complete[\s\S]+\*$/gim;
const URL_RE = /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/g;
function getDeployURLs(output) {
    var _a;
    const deployOutput = (_a = BUILD_COMPLETE_RE.exec(output)) === null || _a === void 0 ? void 0 : _a[0];
    if (!deployOutput)
        return;
    // successful deployments have 3 URLs in the order defined in the interface
    const [buildUrl, permalinkUrl, edgeUrl] = (deployOutput.match(URL_RE));
    return { buildUrl, permalinkUrl, edgeUrl };
}
exports.default = getDeployURLs;
