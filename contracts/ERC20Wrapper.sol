pragma solidity ^0.4.18;

import "./ERC223.sol";
import "./SafeMath.sol";

contract ERC20 {
    function totalSupply() public view returns (uint256);
    function balanceOf(address holder) public view returns (uint256);
    function allowance(address holder, address other) public view returns (uint256);

    function approve(address other, uint256 amount) public returns (bool);
    function transfer(address to, uint256 amount) public returns (bool);
    function transferFrom(
        address from, address to, uint256 amount
    ) public returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract ERC20Wrapper is ContractReceiver, ERC20 {
  using SafeMath for uint;

  bool private rentrancy_lock = false;
  modifier nonReentrant() {
    require(!rentrancy_lock);
    rentrancy_lock = true;
    _;
    rentrancy_lock = false;
  }

  event Burn(address indexed from, uint256 amount);
  event Mint(address indexed to, uint256 amount);

  ERC223 private originalToken;
  mapping (address => uint256) private _balances;
  mapping (address => mapping (address => uint256)) private _allowances;
  string private _name;
  string private _symbol;

  // constructor
  function ERC20Wrapper(address token, string name, string symbol) public {
    originalToken = ERC223(token);
    _name = name;
    _symbol = symbol;
  }

  // views
  function totalSupply() public view returns (uint256) {
    // supply of wrapped token is equal to the wrapper's collateral balance
    return originalToken.balanceOf(address(this));
  }
  function decimals() public view returns (uint8) {
    return originalToken.decimals();
  }
  function balanceOf(address account) public view returns (uint256) {
    return _balances[account];
  }
  function allowance(address owner, address spender) public view returns (uint256) {
    return _allowances[owner][spender];
  }
  function name() public constant returns (string) {
    return _name;
  }
  function symbol() public constant returns (string) {
    return _symbol;
  }

  // erc20 public interface
  // incoming ETH -> revert
  function () public payable {
    revert();
  }
  function approve(address other, uint256 amount) public returns (bool) {
    _approve(msg.sender, other, amount);
    return true;
  }
  function transfer(address to, uint256 amount) public returns (bool) {
    _transfer(msg.sender, to, amount);
    return true;
  }
  function transferFrom(
      address from, address to, uint256 amount
  ) public returns (bool) {
    _transfer(from, to, amount);
    _approve(from, msg.sender, _allowances[from][msg.sender].sub(amount));
    return true;
  }
  // these two functions manipulating allowance aren't in ERC20 standard but
  // may be implemented by some #defi smart contracts so we just add them
  function increaseAllowance(address spender, uint256 addedValue) public returns (bool) {
    _approve(msg.sender, spender, _allowances[msg.sender][spender].add(addedValue));
    return true;
  }
  function decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool) {
    _approve(msg.sender, spender, _allowances[msg.sender][spender].sub(subtractedValue));
    return true;
  }

  // erc20wrapper public interface
  function tokenFallback(address from, uint256 amount, bytes) public {
    // incoming ERC223 -> only allow wrapped token
    require(msg.sender == address(originalToken));
    // mint ERC20 token in same amount as received erc223
    _mint(from, amount);
  }
  function burn(uint256 amount) public returns (bool) {
    _burn(msg.sender, amount);
    return true;
  }
  function burnFrom(address requestor, uint256 amount) public returns (bool) {
    _approve(requestor, msg.sender, _allowances[requestor][msg.sender].sub(amount));
    _burn(requestor, amount);
    return true;
  }

  // private helpers
  function _transfer(address sender, address recipient, uint256 amount) private {
    require(sender != address(0));
    require(recipient != address(0));
    _balances[sender] = _balances[sender].sub(amount);
    _balances[recipient] = _balances[recipient].add(amount);
    Transfer(sender, recipient, amount);
  }
  function _approve(address owner, address spender, uint256 amount) private {
    require(owner != address(0));
    require(spender != address(0));
    _allowances[owner][spender] = amount;
    Approval(owner, spender, amount);
  }
  function _mint(address account, uint256 amount) private nonReentrant {
    _balances[account] = _balances[account].add(amount);
    Transfer(address(0), account, amount);
    Mint(account, amount);
  }
  function _burn(address account, uint256 amount) private nonReentrant {
    _balances[account] = _balances[account].sub(amount);
    originalToken.transfer(account, amount);
    Transfer(account, address(0), amount);
    Burn(account, amount);
  }
}
