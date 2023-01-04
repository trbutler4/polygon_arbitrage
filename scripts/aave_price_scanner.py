from brownie import Contract, network, config, interface

ORACLE = config["networks"][network.show_active()]["AAVE_ORACLE"]
WETH = config["networks"][network.show_active()]["WETH_TOKEN"]

def main():
    oracle = interface.IPriceOracle(ORACLE)
    print(oracle.getAssetPrice(WETH))
