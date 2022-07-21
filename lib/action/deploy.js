"use strict";
// inputs
// required:
// - deploy token
// optional:
// - environment (defaults to production)
// - branch name (current branch default)
// - deploy script (defaults to `0 deploy` or can take a package script name)
// - add pr comment after deploy
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const exec_1 = __importDefault(require("@actions/exec"));
const checkEnvironment_1 = __importDefault(require("../utils/checkEnvironment"));
const deployOutput_1 = __importDefault(require("../utils/deployOutput"));
const packageManager_1 = require("../utils/packageManager");
function deploy() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        (0, checkEnvironment_1.default)();
        try {
            // set the deploy token to the env from user's input
            const $deploy_token = core.getInput('token');
            core.setSecret($deploy_token);
            process.env['LAYER0_DEPLOY_TOKEN'] = $deploy_token;
            const deployCmd = [];
            const { execCmd, runCmd } = yield (0, packageManager_1.getPackageManager)();
            const pkg = yield (0, packageManager_1.getPackage)();
            // if a 'edgio:deploy' script is defined, use this instead of default deploy command
            //@ts-ignore
            const customDeployCmd = (_a = pkg.scripts) === null || _a === void 0 ? void 0 : _a['edgio:deploy'];
            if (customDeployCmd) {
                deployCmd.push(runCmd);
                deployCmd.push(customDeployCmd);
            }
            else {
                deployCmd.push(execCmd);
                deployCmd.push('0 deploy');
            }
            let deployOutput = '';
            let deployError = '';
            const options = {
                listeners: {
                    stdout: (data) => {
                        deployOutput += data.toString();
                    },
                    stderr: (data) => {
                        deployError += data.toString();
                    },
                },
            };
            // execute the deploy
            yield exec_1.default.exec(deployCmd[0], deployCmd.slice(1), options);
            // set deploy URLs to output for following steps
            const urls = (0, deployOutput_1.default)(deployOutput);
            if (urls) {
                for (let key in urls) {
                    core.setOutput(key, urls[key]);
                }
            }
        }
        catch (error) {
            //@ts-ignore
            core.setFailed(error.message);
        }
    });
}
exports.default = deploy;
