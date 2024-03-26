// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "hardhat/console.sol"; 

contract Assessment {
    address payable public owner;
    uint256 private balance;
    string private passcode;
    uint256 private passcodeChangeCount;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event PassCodeChange(string pass);

    constructor(uint initBalance,string memory passCode) payable {
        owner = payable(msg.sender);
        balance = initBalance;
        passcode = passCode;
        passcodeChangeCount = 0;
    }
    modifier IsOwner() {
        require(msg.sender == owner, "You are not the owner of this account.");
        _;
    }
    modifier PassCodePass(string memory _passCode){
        _;
        require(compareStrings(passcode,_passCode),"Incorrect passcode");
    }
    function compareStrings(string memory a, string memory b) internal pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }
    function getBalance() public view returns(uint256){
        return balance;
    }
    function getPassCode() public view returns(string memory){
        return passcode;
    }
    function getPassCodeChangeCount() public view returns(uint256){
        return passcodeChangeCount;
    }

    function deposit(uint256 _amount,string memory _passCode) IsOwner PassCodePass(_passCode) public payable {
        
        uint _previousBalance = balance;
        // perform transaction
        balance += _amount;

        // assert transaction completed successfully
        assert(balance == _previousBalance + _amount);

        // emit the event
        emit Deposit(_amount);
    }

    // custom error
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount,string memory _passCode) IsOwner PassCodePass(_passCode) public  {
        uint _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        // withdraw the given amount
        balance -= _withdrawAmount;

        // assert the balance is correct
        assert(balance == (_previousBalance - _withdrawAmount));

        // emit the event
        emit Withdraw(_withdrawAmount);
    }
    function changePassCode(string memory _currPassCode,string memory _newPassCode) IsOwner public{
        require(compareStrings(passcode,_currPassCode),"Incorrect passcode");
        string memory oldPasscode = passcode;

        if(compareStrings(oldPasscode, _newPassCode)){
            revert("Password same as before");
        }
        
        passcode = _newPassCode;
        passcodeChangeCount += 1;
        
        assert(!compareStrings(_newPassCode, oldPasscode));
        
        emit PassCodeChange(_newPassCode);
    }
}
