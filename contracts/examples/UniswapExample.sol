// SPDX-License-Identifier: GPL-2.0-or-later

// this contract adapted from uniswap docs example

pragma solidity ^0.8.0;
pragma abicoder v2;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/lib/contracts/libraries/TransferHelper.sol";

contract UniswapExample {

    ISwapRouter public immutable swapRouter;
    address public dai;
    address public weth;
    //address public usdc;

    // For this example, we will set the pool fee to 0.3%.
    uint24 public constant poolFee = 3000; // NOTE: fee is in hundredths of basis points

    constructor(ISwapRouter _swapRouter, address _dai, address _weth) {
        swapRouter = _swapRouter;
        dai = _dai;
        weth = _weth;
    }

    // @notice swap a fixed amount of DAI for max possible amount of weth
    // using DAI/WETH 0.3% pool by calling 'exactInputSingle' in the swap router 
    // @dev the calling address must approve this contract to spend at least 'amountIn' worth of DAI
    // @param amountIn the exact amount of DAI that will be swapped for weth 
    // @return amountOut the amount of weth received.
    function swapExactInputSingle(uint256 amountIn) external returns (uint256 amountOut) {
        // NOTE: msg.sender must approve this contract 

        // transfer the specified amount of DAI to this contract 
        TransferHelper.safeTransferFrom(dai, msg.sender, address(this), amountIn);

        // approve the router to spend DAI 
        TransferHelper.safeApprove(dai, address(swapRouter), amountIn);

        // build the swap 
        ISwapRouter.ExactInputSingleParams memory params = 
            ISwapRouter.ExactInputSingleParams({
                tokenIn: dai,
                tokenOut: weth,
                fee: poolFee,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0 
            });

        // execute the swap 
        amountOut = swapRouter.exactInputSingle(params);
    }
}


