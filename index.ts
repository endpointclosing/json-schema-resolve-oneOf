import * as _ from 'lodash';

function resolveOneOf(inputSpec: any): any {
    if (inputSpec && typeof inputSpec === 'object'
        && Object.keys(inputSpec).length > 0
    ) {
        if (inputSpec.oneOf) {
            const oneOf = inputSpec.oneOf;
            delete inputSpec.oneOf;
            const nested = _.mergeWith({}, ...oneOf, customizer);
            inputSpec = _.defaultsDeep(inputSpec, nested, customizer);
        }
        Object.keys(inputSpec).forEach((key: string) => {
            inputSpec[key] = resolveOneOf(inputSpec[key]);
        });
    }
    return inputSpec;
}

const customizer = (objValue: any, srcValue: any) => {
    if (_.isArray(objValue)) {
        return _.union(objValue, srcValue);
    }
    return;
};

export = resolveOneOf;
