from scripts.helpers import get_account, get_pool_address_provider
from scripts.deploy import deploy_flashswap, fund_flashswap
from brownie import config, network, interface


def test_deploy_flashswap():
    account = get_account()
    fs = deploy_flashswap(account)
    assert fs is not None

def test_fund_flashswap():
    account = get_account()
    fs = deploy_flashswap(account)
    fund_flashswap(account)
    assert fs.balance() > 0
