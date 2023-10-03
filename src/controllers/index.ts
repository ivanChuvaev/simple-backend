import { Express } from 'express'
import requireAll from 'require-all'

function flattenRequireAll(modules: any): Array<(app: Express) => void> {
  const flattened = [];

  for (const key in modules) {
    const value = modules[key];

    if (typeof value === 'object') {
      flattened.push(...flattenRequireAll(value));
    } else {
      flattened.push(value);
    }
  }

  return flattened;
}

export default (app: Express) => {
  const controllers = requireAll({
    dirname: __dirname,
    filter: /^(?!index\.ts).*\.ts$/,
    recursive: true
  })

  flattenRequireAll(controllers).forEach(makeControllerFunction => {
    makeControllerFunction(app)
  })
}
