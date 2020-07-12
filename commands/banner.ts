import chalk from "chalk";
import * as figlet from "figlet";

figlet.text(process.argv[2], (error: unknown, data: unknown) => {
  if (error) {
    return process.exit(1);
  }

  console.log(chalk.blue(data));
  console.log("");
  return process.exit(0);
});
