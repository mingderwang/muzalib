import {Command} from '@oclif/core'
import { Sdk, EnvNames, Env, randomPrivateKey, NetworkNames } from 'etherspot';
import { logger } from '../../common';
import { utils } from 'ethers'
Env.defaultName = 'testnets' as EnvNames;
import {
  ContractNames, 
  getContractAbi, 
  getContractAddress,
  getContractByteCode, 
} from '@etherspot/contracts';

export default class World extends Command {
  static description = 'Say hello world'

  static examples = [
    `$ oex hello world
hello world! (./src/commands/hello/world.ts)
`,
  ]

  static flags = {}

  static args = []
 
  async run(): Promise<void> {
    console.log(
      'PaymentRegistry mainnet address:', 
      getContractAddress(ContractNames.PaymentRegistry),
    );

    const privateKey1 = "0xc6498eaaf078004fcd2ff018776f6245abd0e9b116b3c9c4795b024be8ab9f4d" // 0xfBfaBC26f864da843b8992478881846BD22CF5F1
    const privateKey2 = "0x8db69ad91bb9259abf767a39748b1acc179875909244c2a68fac3956227d28b7" // 0xe963E77264DdaBaD71E206D289bebf013db10576
    const privateKey3 = "0x3d1e12daf19c48a35f95bbe06a3ede9c50ad7a2dfd3f85171f81cab6beacc3ca" // 0x8aD7DcEf1a7a63B845872CC532A5FC81B54Ed15c
    const hubSdk = new Sdk(
privateKey1
,  { networkName: NetworkNames.Ropsten }
    );
    const senderSdk = new Sdk(
      privateKey2 
,  { networkName: NetworkNames.Ropsten }

    );
    const recipientSdk = new Sdk(
      privateKey3 
,  { networkName: NetworkNames.Ropsten }

    );
   
    const { state: hubState } = hubSdk;
    const { state: senderState } = senderSdk;
    const { state: recipientState } = recipientSdk;
  console.log('hub p2p',hubState.p2pPaymentDepositAddress)
  console.log('sen p2p',senderState.p2pPaymentDepositAddress)
  console.log('rec p2p',recipientState.p2pPaymentDepositAddress)
    await recipientSdk.computeContractAccount();
    const { accountAddress: hub } = hubState;
    const { accountAddress: sender } = senderState;
    const { accountAddress: recipient } = recipientState;
    console.log('hub   a', hub)
    console.log('send  a', sender)
    console.log('rcv   a', recipient)

    logger.log(
      'payment hub',
      await hubSdk.updatePaymentHub({
        liquidity: utils.parseEther('2'),
      }),
    );

    const output = await senderSdk.getP2PPaymentDeposits();

    console.log('p2p payment deposits', output);
  
  
      await senderSdk.updatePaymentHubDeposit({
        hub,
        totalAmount: utils.parseEther('10000000000'),
      }).catch(console.error);
    
  
    logger.log(
      'payment hub payment (sender > recipient 1 ETH)',
      await senderSdk.createPaymentHubPayment({
        hub,
        recipient,
        value: utils.parseEther('0.01'),
      }),
    );
    logger.log(
      'payment hub payment (sender > recipient 2 ETH)',
      await senderSdk.createPaymentHubPayment({
        hub,
        recipient,
        value: utils.parseEther('0.2'),
      }),
    );
    logger.log(
      'payment hub payment (recipient > sender 1.5 ETH)',
      await recipientSdk.createPaymentHubPayment({
        hub,
        recipient: sender,
        value: utils.parseEther('0.15'),
      }),
    );
  
    logger.log(
      'payment hub recipient deposit',
      await recipientSdk.getPaymentHubDeposit({
        hub,
      }),
    );
    logger.log(
      'payment hub recipient deposit (updated)',
      await recipientSdk.updatePaymentHubDeposit({
        hub,
      }),
    );
  
    const {
      items: [paymentHubChannel],
    } = await recipientSdk.getP2PPaymentChannels();
  
    const { hash } = paymentHubChannel;
  
    logger.log('payment hub recipient p2p channel', paymentHubChannel);
    logger.log(
      'payment hub recipient p2p channel (signed)',
      await hubSdk.signP2PPaymentChannel({
        hash,
      }),
    );
  
    logger.log(
      'batch',
      await recipientSdk.batchCommitP2PPaymentChannel({
        hash,
      }),
    );
    logger.log('estimated batch', await recipientSdk.estimateGatewayBatch());
  
    logger.log('submitted batch', await recipientSdk.submitGatewayBatch());
  
    logger.log('recipient balances', await recipientSdk.getAccountBalances());
  }
}

