import * as path from "path";

const filename = "properties";
const p = path.join(process.cwd(), `env/${filename}.env`);

const dotEnvOptions = {
  path: p,
};

export { dotEnvOptions };
