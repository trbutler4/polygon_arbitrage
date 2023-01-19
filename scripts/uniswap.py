from uniswap import Uniswap
from brownie import network, config

def main():
    matic = config["networks"][network.show_active()]["MATIC"]
    weth = config["networks"][network .show_active()]["WETH"]
    print("matic address: ", matic)
    dai = config["networks"][network.show_active()]["DAI"]
    print("dai address: ", dai)

    # note: this may not be the optimal route
    uniswap = Uniswap(
            address=None, # not making trades
            private_key=None, # not making trades
            version=3,
            provider="https://polygon-mainnet.infura.io/v3/{}".format(config["infura"]),
        )

    # get amount of DAI for 100 MATIC
    price_input = uniswap.get_price_input(weth, dai, 10**18)
    print("Price of 100 MATIC in DAI:", price_input / (10**18))

    # get amount of MATIC for 100 DAI
    price_output = uniswap.get_price_output(matic, dai, 100 * 10**18) # why is this not working?
    print("Price of 100 DAI in MATIC:", price_output / (10**18))
