// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Lunaris {
    mapping(address => uint256) private _balances;
    // Wallet -> Spender -> Amount
    mapping(address => mapping(address => uint256)) private _allowances;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event approval(address indexed _owner, address indexed _spender, uint256 _value);

    constructor() {
        _balances[msg.sender] = totalSupply() / 2;
    }

    function name() public pure returns (string memory) {
        return "Lunaris";
    }

    function symbol() public pure returns (string memory) {
        return "LNR";
    }

    function decimals() public pure returns (uint8) {
        return 18;
    }

    function totalSupply() public pure returns (uint256) {
        return 1000000 * 10 ** uint256(decimals());
    }

    function balanceOf(address _owner) public view returns (uint256) {
        return _balances[_owner];
    }

    function transfer(address _to, uint256 _value) public returns (bool) {
        require(balanceOf(msg.sender) >= _value, "Insufficient balance");
        _balances[_to] += _value;
        _balances[msg.sender] -= _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
    
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool){
        require(_allowances[_to][msg.sender] >= _value, "Allowance exceeded");
        require(balanceOf(_from) >= _value, "Insufficient balance");
        
        _balances[_from] -= _value;
        _balances[_to] += _value;
        _allowances[_to][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool) {
        _allowances[msg.sender][_spender] = _value;
        emit approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender) public view returns (uint256){
        return _allowances[_owner][_spender];
    }
}
