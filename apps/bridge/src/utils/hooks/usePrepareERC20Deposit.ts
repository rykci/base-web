import L1Bridge from 'apps/bridge/src/contract-abis/L1Bridge';
import { Asset } from 'apps/bridge/src/types/Asset';
import { parseUnits } from 'viem';
import getConfig from 'next/config';
import { Address, usePrepareContractWrite } from 'wagmi';
import { prepareWriteContract } from 'wagmi/actions';

const { publicRuntimeConfig } = getConfig();

type UsePrepareERC20DepositProps = {
  asset: Asset;
  depositAmount: string;
  readApprovalResult?: boolean;
  isPermittedToBridge: boolean;
  includeTosVersionByte: boolean;
};

export function usePrepareERC20Deposit({
  asset,
  depositAmount,
  isPermittedToBridge,
  includeTosVersionByte,
}: UsePrepareERC20DepositProps) {
  const { config: depositConfig } = usePrepareContractWrite({
    address:
      isPermittedToBridge && depositAmount !== ''
        ? publicRuntimeConfig.l1BridgeProxyAddress
        : undefined,
    abi: L1Bridge,
    functionName: 'deposit',
    chainId: parseInt(publicRuntimeConfig.l1ChainID),
    args: [
      asset.L1contract as Address,
      depositAmount !== ''
        ? parseUnits(depositAmount, asset.decimals)
        : parseUnits('0', asset.decimals),
    ],
    cacheTime: 0,
    staleTime: 1,
  });
  return depositConfig;
}

export async function prepareERC20Deposit({
  asset,
  depositAmount,
  includeTosVersionByte,
}: UsePrepareERC20DepositProps) {
  return prepareWriteContract({
    address: publicRuntimeConfig.l1BridgeProxyAddress,
    abi: L1Bridge,
    functionName: 'deposit',
    chainId: parseInt(publicRuntimeConfig.l1ChainID),
    args: [
      asset.L1contract as Address,
      depositAmount !== ''
        ? parseUnits(depositAmount, asset.decimals)
        : parseUnits('0', asset.decimals),
    ],
  });
}
