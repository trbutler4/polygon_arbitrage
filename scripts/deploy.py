from brownie import FlashSwap, config, network
from scripts.helpers import get_account, get_pool_address_provider


def main():
    account = get_account()
    fs = deploy_flashswap(account)
    fund_flashswap(account)

def deploy_flashswap(account):
    print("Deploying from account: ", account)
    pool_address_provider = get_pool_address_provider()
    print("Pool address provider: ", pool_address_provider)
    return FlashSwap.deploy(pool_address_provider, {'from': account})

def fund_flashswap(account):
    flashswap = FlashSwap[-1] # get the last deployed contract
    matic = config["networks"][network.show_active()]["ETH"]
    flashswap.fund(matic, 100 * 10 ** 18, {'from': account}) # start off with 100 matic
