from brownie import FlashSwap, config
from scripts.helpers import get_account

def main():
    acct = get_account()
    fs = deploy_flashswap(acct)
    print(fs.POOL())

def deploy_flashswap(acct):
    return FlashSwap.deploy(config['addresses']['MUMBAI_POOL_ADDRESS_PROVIDER'], {'from': acct})
