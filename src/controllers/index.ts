import { Router } from 'express'
import requireAll from 'require-all'

function flattenRequireAll(modules: any): Array<(router: Router) => void> {
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

export default (router: Router) => {
  const controllers = requireAll({
    dirname: __dirname,
    filter: /^(?!index\.ts).*\.ts$/,
    recursive: true
  })

  flattenRequireAll(controllers).forEach(makeControllerFunction => {
    makeControllerFunction(router)
  })
}
