# Spec Event Client

JavaScript client for the Spec event network. 
Easily subscribe to any contract event or custom Spec event published on Spec.

## Installation

```bash
$ npm install @spec.dev/event-client
```

## Quickstart

Subscribe to any event on Spec by name:

```typescript
import { createEventClient, SpecEvent } from '@spec.dev/event-client'

// Create event client.
const spec = createEventClient({ 
    signedAuthToken: process.env.SPEC_API_KEY,
    onConnect: () => 'Listening for Spec events...'
})

// Listen for all new ethereum blocks.
spec.on('eth.NewBlock', (event: SpecEvent) => {
    console.log(event.data)
})

// Listen for PostCreated contract events on Lens.
spec.on('polygon.contracts.lens.LensHubProxy.PostCreated', (event: SpecEvent) => {
    console.log(event.data)
})
```

## Event Interface

All events on Spec share the following interface:

```typescript
interface SpecEvent = {
    id: string
    nonce: string
    name: string
    origin: SpecEventOrigin
    data: StringKeyMap | StringKeyMap[]
}

interface SpecEventOrigin {
    chainId: string
    blockNumber: number
    blockHash: string
    blockTimestamp: string
    transactionHash?: string
    contractAddress?: string
}

type StringKeyMap = { [key: string]: any }
```

## Event Examples:

**Ex: New Ethereum block event:**

```typescript
{
    id: '5Luq7w83pkr25jmG5pEz4D',
    nonce: '1678251758343-0',
    name: 'eth.NewBlock@0.0.1',
    origin: {
        chainId: '1',
        blockNumber: 16781331,
        blockHash: '0xc8923b9cffe5e57756d52df3d74c925019b73b7ac542222c506bc28e150ec67a',
        blockTimestamp: '2023-03-08T05:02:11.000Z'
    },
    data: {
        hash: '0xc8923b9cffe5e57756d52df3d74c925019b73b7ac542222c506bc28e150ec67a',
        number: 16781331,
        parentHash: '0xf83138214faa35db727816ddf52c5193dfbbe9ec882f5fea8fd732a13375dc79',
        nonce: '0x0000000000000000',
        sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
        logsBloom: '0x1675cc245d489ab7f4434510f5191b27892f4f6d66090eaee683b83e378b200...',
        transactionsRoot: '0xf50f4faad3b167cea6367e24429193d295d3692c372d00d5fe9bf412357faa0a',
        stateRoot: '0x7a5360ca3af2f0932c1262d9d43bdef45e11c2245eb38e7279966c685c28e5aa',
        receiptsRoot: '0xda6ef17c32766b643c680c62284a2160679966fb4731c6f5409648addbfdebbd',
        miner: '0x690b9a9e9aa1c9db991c7721a92d351db4fac990',
        difficulty: '0',
        totalDifficulty: '58750003716598352816469',
        size: '71290',
        extraData: '0x406275696c64657230783639',
        gasLimit: '30000000',
        gasUsed: '12970354',
        baseFeePerGas: '19405626329',
        transactionCount: 140,
        timestamp: '2023-03-08T05:02:11.000Z'
    }
}
```

**Ex: Lens PostCreated contract event:**

```typescript
{
    id: 'aiicPFQGc1zug6KZU8Y7Tw',
    name: 'polygon.contracts.lens.LensHubProxy.PostCreated@0.0.1',
    nonce: '1678252171935-0',
    origin: {
        contractAddress: '0xdb46d1dc155634fbc732f92e853b10b288ad5a1d',
        transactionHash: '0x932c32aa280e9728e0391ad1e2790990681030194a873301dd8f93a70ac974a2',
        blockHash: '0xdf58fc920d4b90ff89430344842cf24812a6f0969acfd0ac7934bbd749bc7948',
        blockNumber: 40096072,
        blockTimestamp: '2023-03-08T05:09:25.000Z',
        chainId: '137'
    },
    data: {
        profileId: 9543,
        pubId: 711,
        contentURI: 'https://data.lens.phaver.com/api/lens/posts/a4d6a4e2-8380-40ec-9206-60809d09a800',
        collectModule: '0x23b9467334beb345aaa6fd1545538f3d54436e96',
        collectModuleReturnData: '0x0000000000000000000000000000000000000000000000000000000000000000',
        referenceModule: '0x0000000000000000000000000000000000000000',
        referenceModuleReturnData: null,
        timestamp: 1678252165,
        contractName: 'LensHubProxy',
        contractAddress: '0xdb46d1dc155634fbc732f92e853b10b288ad5a1d',
        transactionHash: '0x932c32aa280e9728e0391ad1e2790990681030194a873301dd8f93a70ac974a2',
        transactionIndex: 14,
        logIndex: '51',
        blockHash: '0xdf58fc920d4b90ff89430344842cf24812a6f0969acfd0ac7934bbd749bc7948',
        blockNumber: 40096072,
        blockTimestamp: '2023-03-08T05:09:25.000Z',
        chainId: '137'
    }
}
```

## License

MIT