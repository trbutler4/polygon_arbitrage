from brownie import FlashSwap
from scripts.helpers import get_account

MUMBAI_POOL_ADDRESS_PROVIDER = "0x5343b5bA672Ae99d627A1C87866b8E53F47Db2E6"

def main():
    acct = get_account()
    fs = deploy_flashswap(acct)
    print(fs.POOL)

def deploy_flashswap(acct):
    return FlashSwap.deploy(MUMBAI_POOL_ADDRESS_PROVIDER, {'from': acct})
