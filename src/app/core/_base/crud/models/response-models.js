"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ResponseStatus;
(function (ResponseStatus) {
    ResponseStatus[ResponseStatus["None"] = 0] = "None";
    ResponseStatus[ResponseStatus["Success"] = 1] = "Success";
    ResponseStatus[ResponseStatus["Error"] = 2] = "Error";
    ResponseStatus[ResponseStatus["Warning"] = 3] = "Warning";
    ResponseStatus[ResponseStatus["Info"] = 4] = "Info";
    ResponseStatus[ResponseStatus["Unknown"] = 5] = "Unknown";
})(ResponseStatus = exports.ResponseStatus || (exports.ResponseStatus = {}));
var ResponseModel = /** @class */ (function () {
    function ResponseModel() {
        this.NewId = 0;
        this.Status = ResponseStatus.Success;
    }
    return ResponseModel;
}());
exports.ResponseModel = ResponseModel;
//# sourceMappingURL=response-models.js.map