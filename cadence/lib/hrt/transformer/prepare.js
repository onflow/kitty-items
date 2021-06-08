const parserBabel = require("prettier/parser-babel");
const prettier = require("prettier");
const cadut = require("flow-cadut");
let Handlebars = require("handlebars");
require("./templates")

const { underscoreToCamelCase } = cadut;

const pretty = (code) => {
    const options = {
        printWidth: 100,
        endOfLine: "lf",
        semi: true,
        useTabs: false,
        singleQuote: false,
        trailingComma: "es5",
        tabWidth: 4,
    };
    return prettier.format(code, {
        parser: "babel",
        plugins: [parserBabel],
        ...options,
    });
};

const prepareTests = (suit, templateName = "empty") => {
    const tests = suit.tests || []
    const output = Handlebars.templates[templateName]({
        suitName: suit.suitName,
        tests: tests.map((test) => {
            const interactions = test.interactions || []

            // Collect number of calls for each script and transaction
            const ixCalls = interactions.reduce((acc, ix) => {
                const { name } = ix;
                if (acc[name]) {
                    acc[name] += 1;
                } else {
                    acc[name] = 1;
                }
                return acc;
            }, {});

            const deployments = test.deploy
                ? test.deploy.map((name) => {
                    return `await deployContractByName({ to: "Registry", name: "${name}" });`;
                })
                : [];

            const deployComment = deployments.length > 0 ? "// Deploy Contracts" : "";

            return {
                name: test.name,
                deployments,
                deployComment,
                interactions: interactions.map((ix, index) => {
                    const { type, name, shallRevert, expect, args, signers } = ix;
                    const fixedArgs = JSON.stringify(args);
                    const fixedSigners = signers
                        ? `signers: ${JSON.stringify(signers)}`
                        : "";
                    switch (type) {
                        case "transaction": {
                            const tx = `sendTransaction({ name: "${name}", args: ${fixedArgs}, ${fixedSigners} })`;
                            return shallRevert
                                ? `await shallRevert( ${tx} )`
                                : `await shallPass( ${tx} )`;
                        }
                        case "script": {
                            const script = `executeScript({ name: "${name}", args: ${JSON.stringify(
                                args
                            )} })`;
                            const resultName = `${underscoreToCamelCase(name)}Result`;
                            // This will allow to call the same script multiple times without overriding const
                            const suffix = ixCalls[name] > 1 ? `${index}` : "";
                            return `
                const ${resultName}${suffix} = await shallResolve( ${script} )
                expect(${resultName}${suffix}).toEqual(${JSON.stringify(
                                expect
                            )})
              `;
                        }
                        default:
                            return `// ${name} have unsupported type`;
                    }
                }),
            };
        }),
    });

    return pretty(output);
};

module.exports = prepareTests;