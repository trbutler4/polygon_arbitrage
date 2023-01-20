// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@aave/core-v3/contracts/flashloan/interfaces/IFlashLoanSimpleReceiver.sol";
import "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import "@aave/core-v3/contracts/interfaces/IPool.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";

contract FlashLoanArbitrage is IFlashLoanSimpleReceiver {

    IPool public POOL;
    IPoolAddressesProvider public ADDRESSES_PROVIDER;
    ISwapRouter public immutable UNISWAP_SWAP_ROUTER;
    address public OWNER;
    address TOKEN0;
    address TOKEN1;

    constructor(
        IPoolAddressesProvider _poolAddressesProvider,
        ISwapRouter _uniswapSwapRouter
    )
    {
        UNISWAP_SWAP_ROUTER = _uniswapSwapRouter;
        ADDRESSES_PROVIDER = _poolAddressesProvider;
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

    // TODO: test this function
    function uniswapSwapExactInputSingle(address _tokenIn, address _tokenOut, uint256 _amount) internal returns (uint256 amountOut) {
        // approve router to spend tokenIn
        TransferHelper.safeApprove(_tokenIn, address(UNISWAP_SWAP_ROUTER), _amount);

        // TODO: use an oracle or other data source to choose a safer value for amountOutMinimum.
        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: _tokenIn,
                tokenOut: _tokenOut,
                fee: 3000, // 0.3%
                recipient: address(this), // receive funds to this contract
                deadline: block.timestamp,
                amountIn: _amount,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        // executes the swap
        amountOut = UNISWAP_SWAP_ROUTER.exactInputSingle(params);
    }

    // TODO: test this function
    // NOTE: this function may not be necessary
    function uniswapSwapExactOutputSingle(
        address _tokenIn,
        address _tokenOut,
        uint256 _amountOut,
        uint256 _amountInMaximum
    ) internal returns (uint256 amountIn) {
        // approve router to spend tokenIn
        TransferHelper.safeApprove(_tokenIn, address(UNISWAP_SWAP_ROUTER), _amountInMaximum);

        // TODO: use an oracle or other data source to choose a safer value for amountInMaximum
        ISwapRouter.ExactOutputSingleParams memory params =
            ISwapRouter.ExactOutputSingleParams({
                tokenIn: _tokenIn,
                tokenOut: _tokenOut,
                fee: 3000, // 0.3%
                recipient: address(this), // receive funds to this contract
                deadline: block.timestamp,
                amountOut: _amountOut,
                amountInMaximum: 0,
                sqrtPriceLimitX96: 0
            });

        // executes the swap
        amountIn = UNISWAP_SWAP_ROUTER.exactOutputSingle(params);

        // For exact output swaps, the amountInMaximum may not have all been spent.
        // If the actual amount spent (amountIn) is less than the specified maximum amount, we must refund the msg.sender and approve the swapRouter to spend 0.
        if (amountIn < _amountInMaximum) {
            TransferHelper.safeApprove(DAI, address(UNISWAP_SWAP_ROUTER), 0);
            TransferHelper.safeTransfer(DAI, msg.sender, _amountInMaximum - amountIn);
        }
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
        // swap token0 for token1 on uniswap
        uniswapSwapExactInputSingle(TOKEN0, TOKEN1, amount)(amount); // swapping all we have borrowed

        // TODO: swap token1 back to token0 on sushiswap

        // repay the borrowed tokens + premium
        uint amountOwed = amount + premium;
        IERC20(asset).approve(address(POOL), amountOwed);

        return true;
    }

}
