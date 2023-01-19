// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@aave/core-v3/contracts/flashloan/interfaces/IFlashLoanSimpleReceiver.sol";
import "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import "@aave/core-v3/contracts/interfaces/IPool.sol";

contract FlashLoanArbitrage is IFlashLoanSimpleReceiver {

    IPool public POOL;
    IPoolAddressesProvider public ADDRESSES_PROVIDER;
    address public OWNER;
    address TOKEN0;
    address TOKEN1;

    constructor(address _poolAddressesProvider) {
        ADDRESSES_PROVIDER = IPoolAddressesProvider(_poolAddressesProvider);
        POOL = IPool(ADDRESSES_PROVIDER.getPool());
        OWNER = msg.sender;
    }


    function executeArbitrage(address _token0, address _token1, uint256 _amount) external {
        address receiver = address(this); // receive funds to this contract
        TOKEN0 = _token0; // token to swap from (what gets borrowed)
        TOKEN1 = _token1; // token to swap to (used for arb)
        uint256 amount = _amount; // amount to swap
        bytes memory params = ""; // params for the receiver contracts
        uint16 referralCode = 0; // referral code for the flash loan (not currently active)

        // get flash loan
        POOL.flashLoanSimple(receiver, TOKEN0, amount, params, referralCode);

    }


    function fund(address _token, uint256 _amount) external {
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
    }


    function withdrawFunds(address _token, uint256 _amount) external {
        require(msg.sender == OWNER, "Only owner can withdraw funds");
        IERC20(_token).transfer(msg.sender, _amount);
    }


    /**
    * @notice Executes an operation after receiving the flash-borrowed asset
    * @dev Ensure that the contract can return the debt + premium, e.g., has
    *      enough funds to repay and has approved the Pool to pull the total amount
    * @param asset The address of the flash-borrowed asset
    * @param amount The amount of the flash-borrowed asset
    * @param premium The fee of the flash-borrowed asset
    * @param initiator The address of the flashloan initiator
    * @param params The byte-encoded params passed when initiating the flashloan
    * @return True if the execution of the operation succeeds, false otherwise
    */
    function executeOperation(
    address asset,
    uint256 amount,
    uint256 premium,
    address initiator,
    bytes calldata params
    ) external returns (bool) {
        // do something with the borrowed tokens


        // repay the borrowed tokens + premium
        uint amountOwed = amount + premium;
        IERC20(asset).approve(address(POOL), amountOwed);

        return true;
    }

}