from brownie import FlashSwap, config
from scripts.helpers import get_account, get_pool_address_provider

def main():
    account = get_account()
    fs = deploy_flashswap(account)

def deploy_flashswap(account):
    print("Deploying from account: ", account)
    pool_address_provider = get_pool_address_provider()
    print("Pool address provider: ", pool_address_provider)
    return FlashSwap.deploy(pool_address_provider, {'from': account})

def fund_flashswap(account, flashswap):
    flashswap = FlashSwap[-1] # get the last deployed contract
    flashswap.fund({'from': account, 'value': '0.1 ether'})
