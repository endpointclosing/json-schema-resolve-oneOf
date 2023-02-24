"use strict";
var _ = require("lodash");
function resolveOneOf(inputSpec) {
    if (inputSpec && typeof inputSpec === 'object') {
        if (Object.keys(inputSpec).length > 0) {
            if (inputSpec.oneOf) {
                var oneOf = inputSpec.oneOf;
                delete inputSpec.oneOf;
                var nested = _.mergeWith.apply(_, [{}].concat(oneOf, [customizer]));
                inputSpec = _.defaultsDeep(inputSpec, nested, customizer);
            }
            Object.keys(inputSpec).forEach(function (key) {
                inputSpec[key] = resolveOneOf(inputSpec[key]);
            });
        }
    }
    return inputSpec;
}
var customizer = function (objValue, srcValue) {
    if (_.isArray(objValue)) {
        return _.union(objValue, srcValue);
    }
    return;
};
module.exports = resolveOneOf;
//# sourceMappingURL=index.js.map