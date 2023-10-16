import { Algorithm, Cryptocurrency, GPU, Graph, Miner, User } from "@/models";
import seq from "global/seq";

export const createSomethingInDatabase = async () => {
  await seq.sync({ force: true });

  const user = await User.create({ login: 'nico', password: 'abcdefghijA!0'})
  await User.create({ login: 'kompachiro', password: 'vertexHello1!'})
  const miner = await Miner.create({ name: 'my_miner' })
  const algorithm = await Algorithm.create({ name: 'haha_alg', type: 'gpu' })
  await miner.$add('algorithm', algorithm)
  const cryptocurrency = await Cryptocurrency.create({ name: 'my_coin', algorithmId: algorithm.id })
  const gpu = await GPU.create({ uuid: '550e8400-e29b-41d4-a716-446655440000'})
  await Graph.create({ cryptocurrencyId: cryptocurrency.id, hashrate: 2435, power: 11, temp: 89, gpuId: gpu.id })
}
