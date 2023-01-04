from brownie import Contract, network, config

def main():
    oracle_address = config["networks"][network.show_active()]["AAVE_ORACLE"]
    #oracle_abi = open("abis/AaveOracle.txt", "r", encoding='utf-8').read()
    #print(oracle_abi)
    #oracle = Contract.from_abi("AaveOracle", oracle_address, oracle_abi)
    oracle = Contract(oracle_address)
