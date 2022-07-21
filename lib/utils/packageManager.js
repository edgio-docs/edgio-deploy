"use strict";
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
exports.getPackage = exports.getPackageManager = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
const core_1 = __importDefault(require("@actions/core"));
const pkg_types_1 = require("pkg-types");
/**
 * Determines the package manager to use based on the lockfile
 * @returns Promise<string> Name of the package manager
 */
function getPackageManager() {
    return __awaiter(this, void 0, void 0, function* () {
        const isYarn = yield fs_extra_1.default.pathExists(path_1.join(process.cwd(), 'yarn.lock'));
        const isNpm = yield fs_extra_1.default.pathExists(path_1.join(process.cwd(), 'package-lock.json'));
        // Ensure a compatible package manager is availble
        if (!isNpm && !isYarn) {
            core_1.default.setFailed('Could not identify npm or Yarn from lockfile. ' +
                'Please ensure `package-lock.json` or `yarn.lock` exists.');
            process.exit(1);
        }
        return {
            isNpm,
            isYarn,
            runCmd: isYarn ? 'yarn' : 'npm run',
            execCmd: isYarn ? 'yarn' : 'npx',
        };
    });
}
exports.getPackageManager = getPackageManager;
/**
 * Gets the parsed package.json contents
 * @returns Promise<Object> package.json parsed
 */
function getPackage() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield pkg_types_1.readPackageJSON(path_1.join(process.cwd(), 'package.json'));
    });
}
exports.getPackage = getPackage;
