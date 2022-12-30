from brownie import accounts, network

def get_account():
    if network.show_active() == "development":
        return accounts[0]
    elif network.show_active() in ["polygon-test"]:
        return accounts.load("mm-dev")
