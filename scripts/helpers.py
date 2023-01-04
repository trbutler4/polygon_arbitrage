from brownie import accounts, network, config

def get_account():
    if network.show_active() == "polygon-main-fork":
        return accounts[0]
    elif network.show_active() in ["polygon-test"]:
        return accounts.load("mm-dev")

def get_pool_address_provider():
    return config["networks"][network.show_active()]["POOL_ADDRESSES_PROVIDER"]
