import jetpack from "fs-jetpack";
import chalk from "chalk";

const pjson = jetpack.read("./package.json", "json");
const parseVersion = (nodeVersionString) => {
  const majorVersion = nodeVersionString.split(".")[0];

  // use regex to remove leading chars such as "v", "^", "<", ">", ""="
  const majorVersionIntOnly = majorVersion.replace(/[^0-9]/g,"");

  return parseInt(majorVersionIntOnly);
}

const processNodeVersion = parseVersion(process.version)
const engineNodeRequirement = parseVersion(pjson.engines.node);

if (processNodeVersion < engineNodeRequirement) {
  console.log(
    `This project requires Node version ${chalk.yellow(
      pjson.engines.node
    )} or higher. Please install Node.js and try again.${"\n"}`
  );

  process.exit(1);
}