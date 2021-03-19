pragma solidity >=0.6.0 <0.7.0;
pragma experimental ABIEncoderV2;

//import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IWETH9.sol";

/*

  Credibly Neutral Token Allocator

  1) On deploy an allocations array is created.

  2) Tokens are sent to the contract.

  3) Anyone can call `distribute( tokenAddress )` to split funds within the
    contract by the allocation ratio and send them to each wallet.

  4) Owner can set allocation ratios.


    //KNOWN 'GOTCHAS' SO FAR

    the allocation wallet could be crafted to "lock" transfers by failing
      (withdraw pattern might be better?)

    limit is 256 allocation recipients
      (easily adjusted)
*/

contract Allocator is ReentrancyGuard, Ownable{

  event Distribute( address indexed token, address indexed wallet, uint256 amount );
  event AllocationSet( address[] recipients, uint8[] ratios );

  constructor(address payable _WETH,address newOwner,address[] memory wallets,uint8[] memory ratios) public {
    setWETHAddress( _WETH );
    setAllocation( wallets, ratios );
    transferOwnership( newOwner );
  }

  uint8 public denominator = 0;
  address payable public WETH;
  address[] public recipients;
  uint8[] public ratios;

  //accepts eth
  receive() external payable {
    IWETH9 wethContract = IWETH9(WETH);
    wethContract.deposit{value:msg.value}();
  }

  function setAllocation( address[] memory _wallets, uint8[] memory _ratios ) public onlyOwner {
    require( _wallets.length > 0 ,"Not enough wallets");
    require( _wallets.length < 256 ,"Too many wallets");
    require( _wallets.length == _ratios.length ,"Wallet and Ratio length not equal");
    recipients = _wallets;
    ratios = _ratios;
    denominator=0;
    for(uint8 i = 0; i < recipients.length; i++){
      denominator+=_ratios[i];
    }
    emit AllocationSet(recipients,ratios);
  }

  function setWETHAddress(address payable _WETH) public onlyOwner {
    WETH = _WETH;
  }

  function distribute(address tokenAddress) public nonReentrant {
    IERC20 tokenContract = IERC20(tokenAddress);
    uint256 balance = tokenContract.balanceOf(address(this));
    for(uint8 i = 0; i < recipients.length; i++){
      uint256 amount = balance * ratios[i] / denominator;
      tokenContract.transfer( recipients[i], amount );
      emit Distribute( tokenAddress, recipients[i], amount );
    }
  }

  function allocationsLength() public view returns(uint8 count) {
      return uint8(recipients.length);
  }
}
