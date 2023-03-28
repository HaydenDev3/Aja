"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Deps {
  static get(type) {
    var _a;
    return (_a = this.deps.get(type)) !== null && _a !== void 0
      ? _a
      : this.add(type, new type());
  }
  static add(type, instance) {
    return this.deps.set(type, instance).get(type);
  }
}
exports.default = Deps;
Deps.deps = new Map();
