"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandErrorEnums = exports.LoggingTypes = void 0;
var LoggingTypes;
(function (LoggingTypes) {
    LoggingTypes["alert"] = "alert";
    LoggingTypes["warning"] = "warning";
    LoggingTypes["info"] = "info";
    LoggingTypes["debug"] = "debug";
})(LoggingTypes = exports.LoggingTypes || (exports.LoggingTypes = {}));
var CommandErrorEnums;
(function (CommandErrorEnums) {
    CommandErrorEnums["ADDCHAR"] = "ADDCHAR";
    CommandErrorEnums["CHANGE_CHANNEL"] = "CHANGE_CHANNEL";
    CommandErrorEnums["CLEAR_SESSION"] = "CLEAR_SESSION";
    CommandErrorEnums["COLLECT_ROLLS"] = "COLLECT_ROLLS";
    CommandErrorEnums["HELP"] = "HELP";
    CommandErrorEnums["LINK"] = "LINK";
    CommandErrorEnums["MATHS"] = "MATHS";
    CommandErrorEnums["NEXT"] = "NEXT";
    CommandErrorEnums["PREVIOUS"] = "PREVIOUS";
    CommandErrorEnums["RESORT"] = "RESORT";
    CommandErrorEnums["ROLL"] = "ROLL";
    CommandErrorEnums["START"] = "START";
    CommandErrorEnums["TABLE"] = "TABLE";
})(CommandErrorEnums = exports.CommandErrorEnums || (exports.CommandErrorEnums = {}));
