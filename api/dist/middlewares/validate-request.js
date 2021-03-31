"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
var express_validator_1 = require("express-validator");
// validateRequest works in conjunction with the 'express-validator' package. If we use the validations from
// 'express-validator', this middleware will check if any errors were thrown within the route and then
// return an appropriate error message to the API user.
var validateRequest = function (req, res, next) {
    var errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({
            errors: errors.array(),
        });
    }
    next();
};
exports.validateRequest = validateRequest;
