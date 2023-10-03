export { default as User } from './User'
export { default as Session } from './Session'
export { default as Wallet } from './Wallet'
export { default as Cryptocurrency } from './Cryptocurrency'
export { default as Algorithm } from './Algorithm'
export { default as Miner } from './Miner'
export { default as AlgorithmMiner } from './AlgorithmMiner'
export { default as Harddrive } from './Harddrive'
export { default as GPU } from './GPU'
export { default as CPU } from './CPU'
export { default as Graph } from './Graph'
export { default as Pool } from './Pool'
import { Sequelize } from 'sequelize-typescript'
import requireAll from 'require-all'

function flattenRequireAll(modules: any): Array<any> {
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

export default (sequelize: Sequelize) => {
  const models = requireAll({
    dirname: __dirname,
    filter: /^(?!index\.ts).*\.[tj]s$/,
    recursive: true
  })
  sequelize.addModels(flattenRequireAll(models))
}
