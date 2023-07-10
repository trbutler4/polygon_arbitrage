// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@aave/core-v3/contracts/flashloan/interfaces/IFlashLoanSimpleReceiver.sol";
import "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import "@aave/core-v3/contracts/interfaces/IPool.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

contract FlashLoanArbitrage is IFlashLoanSimpleReceiver {

    IPool public POOL;
    IPoolAddressesProvider public ADDRESSES_PROVIDER;
    ISwapRouter public immutable UNISWAP_SWAP_ROUTER;
    IUniswapV2Router02 public immutable SUSHISWAP_SWAP_ROUTER;
    address private OWNER;
    address TOKEN0;
    address TOKEN1;

    constructor(
        IPoolAddressesProvider _poolAddressesProvider,
        ISwapRouter _uniswapSwapRouter,
        IUniswapV2Router02 _sushiswapSwapRouter
    )
    {
        UNISWAP_SWAP_ROUTER = _uniswapSwapRouter;
        ADDRESSES_PROVIDER = _poolAddressesProvider;
        SUSHISWAP_SWAP_ROUTER = _sushiswapSwapRouter;
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


    function deposit() public payable {
        require(msg.value > 0, "Cannot deposit 0 or less wei");
    }

    function depositToken(address _token, uint256 _amount) public {
        require(IERC20(_token).transferFrom(msg.sender, address(this), _amount), "Deposit Failed");
    }

    function withdrawFunds(address _token, uint256 _amount) external {
        require(msg.sender == OWNER, "Only owner can withdraw funds");
        IERC20(_token).transfer(msg.sender, _amount);
    }

    // TODO: test this function
    function uniswapSwap(address _tokenIn, address _tokenOut, uint256 _amount) external returns (uint256 amountOut) {

        // transfer tokens to this contract
        //TransferHelper.safeTransfer(_tokenIn, address(this), _amount); 

        // approve router to spend tokenIn
        //TransferHelper.safeApprove(_tokenIn, address(UNISWAP_SWAP_ROUTER), _amount);

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

    function sushiswapSwap(address _tokenIn, address _tokenOut, uint _amount) external returns (uint256[] memory amounts) {

        // transfer tokens to this contract
        TransferHelper.safeTransfer(_tokenIn, address(this), _amount);

        // approve router to spend _tokenIn
        TransferHelper.safeApprove(_tokenIn, address(SUSHISWAP_SWAP_ROUTER), _amount);

        address[] memory path = new address[](2);
        path[0] = _tokenIn;
        path[1] = _tokenOut;

        amounts = SUSHISWAP_SWAP_ROUTER.swapExactTokensForTokens(
           _amount,
           0, // amountOutMin
           path,
           address(this), // receive to this contract
           0 // deadline
        );
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
        uint256 swap1Amount = this.uniswapSwap(TOKEN0, TOKEN1, amount); // swapping all we have borrowed

        // TODO: swap token1 back to token0 on sushiswap
        this.sushiswapSwap(TOKEN1, TOKEN0, swap1Amount); // swap all that we got from uniswap

        // repay the borrowed tokens + premium
        uint amountOwed = amount + premium;
        IERC20(asset).approve(address(POOL), amountOwed);

        return true;
    }

}
