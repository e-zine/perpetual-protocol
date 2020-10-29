/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { setupLoader, TruffleLoader, Web3Loader } from "@openzeppelin/contract-loader"
import { TxParams } from "@openzeppelin/upgrades"
import { GAS, GAS_PRICE } from "../constants"

// eslint-disable-next-line
const { ethers, upgrades } = require("@nomiclabs/buidler")

export interface OzNetworkConfig {
    network: string
    txParams: TxParams
}

export interface OzContractLoader {
    web3: Web3Loader
    truffle: TruffleLoader
}

export class OzScript {
    private readonly contractLoader: OzContractLoader
    private readonly ozInitMethodName = "initialize"

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(private readonly provider: any, readonly networkConfig: OzNetworkConfig) {
        this.contractLoader = setupLoader({
            provider, // either a web3 provider or a web3 instance
            defaultSender: networkConfig.txParams.from!, // optional
            defaultGas: GAS, // optional, defaults to 200 thousand
            defaultGasPrice: GAS_PRICE, // optional, defaults to 1 gigawei
        })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async deploy(contractAlias: string, contractFileName: string, args: any[]): Promise<string> {
        // deploy contract by open zeppelin cli
        // ozScript won't replace the existing one, we have to manually remove it before deploy new contract first time
        const contract = await ethers.getContractFactory(contractFileName)
        const instance = await upgrades.deployProxy(contract, args, {
            initializer: this.ozInitMethodName,
            unsafeAllowCustomTypes: true,
        })
        return instance.address
    }

    // TODO migrate to openzeppelin upgrade
    // async upgrade(contractAlias: string, contractFileName: string): Promise<void> {
    //     const { network, txParams } = this.networkConfig
    //     scripts.add({ contractsData: [{ name: contractFileName, alias: contractAlias }] })
    //     await scripts.push({ network, txParams, force: true })
    //     await scripts.update({
    //         contractAlias: contractAlias,
    //         network,
    //         txParams,
    //         all: false,
    //     })
    // }

    getTruffleContractInstance<T>(contractName: string, address?: string): T {
        return this.contractLoader.truffle.fromArtifact(contractName, address) as T
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getWeb3ContractInstance(contractName: string, address?: string): any {
        return this.contractLoader.web3.fromArtifact(contractName, address)
    }
}