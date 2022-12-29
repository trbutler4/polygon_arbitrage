pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@aave/contracts/flashloan/interfaces/IFlashLoanSimpleReceiver.sol";

contract FlashSwap {

    constructor() {}

    function flashSwap(address _token, uint256 _amount) external {
        IFlashLoanSimpleReceiver receiver = IFlashLoanSimpleReceiver(address(this));
        IERC20(_token).approve(address(receiver), _amount);
        receiver.executeOperation(_token, _amount, 0);
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
        return true;
    }


}
