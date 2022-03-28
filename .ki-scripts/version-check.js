import jetpack from "fs-jetpack";
import chalk from "chalk";

const pjson = jetpack.read("./package.json", "json");

if (!process.version.split(".")[0].includes(pjson.engines.node.split(".")[0])) {
  console.log(
    `This project requires Node version ${chalk.yellow(
      pjson.engines.node
    )} or higher. Please install Node.js and try again.${"\n"}`
  );

  process.exit(1);
}
