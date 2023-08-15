// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.6;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./IRandomNumberGenerator.sol";

contract Lotto666 is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // percentage of the pool to be paid to treasury
    uint256 public treasuryFee = 1;
    address public treasuryAddress;

    uint256 public ticketPrice = 2 ether;

    IERC20 public usdToken;
    IRandomNumberGenerator public randomGenerator;
    uint256 public closeBlockNumber = 0;
    uint256 public requestRandomnessBlockNumber = 0;

    // Unclaimed ticket prize pool will be added to the jackpot.
    // The jackpot will be distributed to the first prize winner.
    uint256 public jackpotAmount = 0;

    struct Ticket {
        // uint16 id;
        // ticket number: 6 number from 1 to 66. Every number can be used only once, and number is sorted in ascending order
        uint224 number;
        /// bracket => number of matched digits, 0 means hit 1 number, 5 means hit 6 numbers
        uint32 bracket;
        address owner;
    }
    /// @notice mapping ticketId => tickets
    mapping(uint256 => Ticket) private _tickets;
    uint256 public currentTicketId = 0;
    uint256 public lotteryLength = 5 days;
    uint256 public rewardingLength = 2 days - 4 hours;

    enum Status {
        Pending,
        Open,
        Close,
        Claimable
    }

    Status public status = Status.Pending;
    // start selling tickets
    uint256 public startTime;
    // end selling tickets
    uint256 public endTime;
    // uses must claim their prizes before this time
    uint256 public endRewardTime;
    // rewardsBreakdown[0] means the total reward percentage for all tickets hit 1 number, 5 means the ticket hit 6 numbers
    uint256[6] public rewardsBreakdown = [0, 15, 15, 15, 15, 40];
    // rewardsForBracket[0] means the reward amount for one ticket hit 1 number, 5 means the reward amount for one ticket hit 6 numbers
    uint256[6] public rewardsForBracket = [0, 0, 0, 0, 0, 0];
    uint256 public finalNumber = 0;

    // plan for the next lottery
    event LotterySet(uint256 indexed startTime);
    event LotteryDrawn(
        uint256 indexed startTime,
        uint256 finalNumber,
        //first prize winner
        uint256 countWinningTickets
    );
    event NewTreasuryAddress(address indexed treasury);
    event NewRandomGenerator(address indexed randomGenerator);
    event TicketsPurchase(address indexed buyer, uint256 numberTickets);
    event TicketsClaim(address indexed claimer, uint256 amount);

    modifier notContract() {
        require(!_isContract(msg.sender), "Contract not allowed");
        require(msg.sender == tx.origin, "Proxy contract not allowed");
        _;
    }

    constructor(
        address _usdTokenAddress,
        address _randomGeneratorAddress,
        address _treasuryAddress
    ) {
        usdToken = IERC20(_usdTokenAddress);
        randomGenerator = IRandomNumberGenerator(_randomGeneratorAddress);
        treasuryAddress = _treasuryAddress;
    }

    function setTreasuryAddresses(address _treasuryAddress) external onlyOwner {
        treasuryAddress = _treasuryAddress;
        emit NewTreasuryAddress(_treasuryAddress);
    }

    function setRandomGenerator(
        address _randomGeneratorAddress
    ) external onlyOwner {
        randomGenerator = IRandomNumberGenerator(_randomGeneratorAddress);
        emit NewRandomGenerator(_randomGeneratorAddress);
    }

    function setUSDToken(address _usdTokenAddress) external onlyOwner {
        usdToken = IERC20(_usdTokenAddress);
    }

    function setTreasuryFee(uint256 _treasuryFee) external onlyOwner {
        treasuryFee = _treasuryFee;
    }

    function setTicketPrice(uint256 _ticketPrice) external onlyOwner {
        ticketPrice = _ticketPrice;
    }

    //  Only can change the percentage of each prizes on the pending.
    function setRewardsBreakdown(
        uint256[6] memory _rewardsBreakdown
    ) external onlyOwner {
        require(status == Status.Pending, "Can't change rewards now");
        rewardsBreakdown = _rewardsBreakdown;
    }


    // A function to open a new lottery, status=pending means start a game ,
    // but do not sell ticket.
    function resetForNewLottery(
        uint256 _startTime,
        uint256 _endTime
    ) external onlyOwner {
        if (status == Status.Claimable) {
            require(
                block.timestamp > endRewardTime,
                "Cannot reset before endRewardTime"
            );
        }
        require(
            _startTime != 0 || _endTime != 0,
            "Cannot reset with 0 startTime and endTime"
        );
        if (_endTime != 0) {
            _startTime = _endTime - lotteryLength;
        }
        require(
            _startTime > block.timestamp,
            "Cannot start with startTime in the past"
        );

        status = Status.Pending;
        startTime = _startTime;
        endTime = _startTime + lotteryLength;
        endRewardTime = endTime + rewardingLength;
        currentTicketId = 0;
        jackpotAmount = usdToken.balanceOf(address(this));
        emit LotterySet(startTime);
    }

    //---------------------------------- MY CHANGE: Game only can setup, start, close by owner,so add onlyOwner ----------//
    //change
    // A function start to sell the tickets and the status = open means can sell ticket.
    function startLottery() external notContract onlyOwner{
        require(status == Status.Pending, "Lottery already started");
        require(
            startTime <= block.timestamp,
            "Cannot start lottery before startTime"
        );
        status = Status.Open;
    }

    //change
    function closeLottery() external notContract onlyOwner{
        require(
            endTime <= block.timestamp,
            "Cannot close lottery before endTime"
        );
        require(status == Status.Open, "Lottery not open");
        status = Status.Close;
        closeBlockNumber = block.number;
    }

    //--------------------my question: why block number cannot be same as closeBlockNumber ??-------------//
    // draw lottery: frist, request randomness from randomGenerator
    function requestRandomness(
        uint256 seedHash
    ) external notContract onlyOwner {
        require(status == Status.Close, "Lottery not closed");
        require(
            endRewardTime > block.timestamp,
            "Cannot draw lottery after endRewardTime"
        );
        require(
            block.number != closeBlockNumber,
            "requestRandomness cannot be called in the same block as closeLottery"
        );
        requestRandomnessBlockNumber = block.number;
        randomGenerator.requestRandomValue(seedHash);
    }

    //----------------------------------- Problem: ??? what is the use of getRandomTicketNumber-----------------------//
    // draw lottery: second, reveal randomness from randomGenerator
    function revealRandomness(uint256 seed) external notContract onlyOwner {
        require(status == Status.Close, "Lottery not closed");
        require(
            endRewardTime > block.timestamp,
            "Cannot draw lottery after endRewardTime"
        );
        require(
            block.number != requestRandomnessBlockNumber,
            "revealRandomness cannot be called in the same block as requestRandomness"
        );
        status = Status.Claimable;

        // calculate the finalNumber from randomResult
        uint256 randomNumber = randomGenerator.revealRandomValue(seed);
        finalNumber = getRandomTicketNumber(randomNumber);

        drawLottery();
    }

    //--------------------problem: what is the finalNumber???------------------//
    // draw lottery: third, calculate the winning tickets
    function drawLottery() private {
        uint256[] memory countWinningTickets = new uint256[](6);
        for (uint256 i = 0; i < currentTicketId; i++) {
            Ticket storage ticket = _tickets[i];
            uint256 winningNumber = finalNumber;
            uint256 userNumber = ticket.number;
            uint32 matchedDigits = 0;
            for (uint256 index = 0; index < 6; index++) {
                if (winningNumber % 66 == userNumber % 66) {
                    matchedDigits++;
                }
                winningNumber /= 66;
                userNumber /= 66;
            }

            if (matchedDigits > 0) {
                ticket.bracket = matchedDigits - 1;
                countWinningTickets[matchedDigits - 1]++;
            } else {
                delete _tickets[i];
            }
        }

        //---------------------------Problem: what is jackpotAmount??------------------//
        // calculate the prize pool
        uint256 prizePool = usdToken.balanceOf(address(this)) - jackpotAmount;
        uint256 fee = (prizePool * treasuryFee) / 100;
        usdToken.transfer(treasuryAddress, fee);
        prizePool -= fee;
        for (uint256 index = 0; index < 5; index++) {
            uint256 countingForBrackets = countWinningTickets[index];
            if (countingForBrackets != 0) {
                rewardsForBracket[index] =
                    (prizePool * rewardsBreakdown[index]) /
                    100 /
                    countingForBrackets;
            }
        }
        // the last bracket is the jackpot
        if (countWinningTickets[5] != 0) {
            rewardsForBracket[5] =
                (jackpotAmount + (prizePool * rewardsBreakdown[5]) / 100) /
                countWinningTickets[5];
        }

        emit LotteryDrawn(startTime, finalNumber, countWinningTickets[5]);
    }

    function buyTickets(
        uint256[] calldata _ticketNumbers
    ) external notContract nonReentrant {
        require(status == Status.Open, "Lottery not open");
        require(block.timestamp < endTime, "Cannot buy tickets after endTime");
        require(_ticketNumbers.length > 0, "Cannot buy 0 tickets");
        uint256 totalCost = _ticketNumbers.length * ticketPrice;
        require(
            usdToken.balanceOf(msg.sender) >= totalCost,
            "Not enough USD to buy ticket"
        );
        usdToken.safeTransferFrom(msg.sender, address(this), totalCost);
        for (uint256 i = 0; i < _ticketNumbers.length; i++) {
            _tickets[currentTicketId++] = Ticket({
                number: uint224(_ticketNumbers[i]),
                bracket: 0,
                owner: msg.sender
            });
        }

        emit TicketsPurchase(msg.sender, _ticketNumbers.length);
    }

    function claimTickets(
        uint256[] calldata _ticketIds
    ) external notContract nonReentrant {
        require(status == Status.Claimable, "Lottery not claimable");
        require(_ticketIds.length > 0, "Cannot claim 0 tickets");
        require(
            block.timestamp < endRewardTime,
            "Cannot claim tickets after endRewardTime"
        );

        uint256 reward = 0;
        for (uint256 i = 0; i < _ticketIds.length; i++) {
            uint256 ticketId = _ticketIds[i];
            require(ticketId < currentTicketId, "Invalid ticketId");
            require(
                _tickets[ticketId].owner == msg.sender,
                "Not the owner of the ticket"
            );

            reward += rewardsForBracket[_tickets[ticketId].bracket];

            delete _tickets[_ticketIds[i]];
        }
        require(reward > 0, "No reward");

        usdToken.safeTransfer(msg.sender, reward);
        emit TicketsClaim(msg.sender, reward);
    }

        function viewTicketNumber
    (
        uint256 number
    ) public pure returns (uint32[] memory) {
        uint32[] memory ticketNumbers = new uint32[](6);
        for (uint256 index = 0; index < 6; index++) {
            ticketNumbers[index] = uint32(number % 66) + 1;  
            // ticketNumbers[index] = uint32(number % 66);  
            number /= 66;
        }
        return ticketNumbers;
    }

    function viewResult() external view returns (uint32[] memory) {
        require(status == Status.Claimable, "Lottery not claimable");
        return viewTicketNumber(finalNumber);
    }

  //-------------change: when there has not gerenate the random number, all tickets are has 0 fit number. Thererfore, add one string "state"
  // to show if the final number has come out or not.----------------------------//
    function viewTicket(
        uint256 ticketId
    ) external view returns (uint32[] memory, uint32, address) { //change
        require(ticketId < currentTicketId, "Invalid ticketId");
        Ticket memory ticket = _tickets[ticketId];
        return (viewTicketNumber(ticket.number), ticket.bracket, ticket.owner); //change
    }

    // ticket number: 6 number from 1 to 66. Every number can be used only once, and number is sorted in ascending order
    // calculate the ticket number from a random number
    function getRandomTicketNumber(
        uint256 randomNumber
    ) public pure returns (uint256) {
        uint8[] memory numbers = new uint8[](66);
        uint256 current = 0;
        for (uint256 i = 0; i < 6; i++) {
            current = (current + (randomNumber % (66 - i))) % 66;
            randomNumber /= 256;
            while (numbers[current] != 0) {
                current++;
                if (current >= 66) {
                    current = 0;
                }
            }
            numbers[current] = 1;
        }
        current = 0;
        uint256 index = 66;
        for (uint256 i = 0; i < 6; index--) {
            if (numbers[index - 1] == 1) {
                current = current * 66 + index - 1;
                i++;
                // although i equals 6, the loop will continue to calculate index--, then it will crash..
                // console.log("Index:  %s, i : %s", index - 1, i);
            }
        }
        return current;
    }

    function viewRewardsBreakdown() external view returns (uint256[6] memory) {
        return rewardsBreakdown;
    }

    function viewRewardsForBracket() external view returns (uint256[6] memory) {
        return rewardsForBracket;
    }

    // get tickets id list of an address
    function viewTicketsOfAddress(
        address owner
    ) public view returns (uint256[] memory) {
        uint256[] memory ownedTickets = new uint256[](currentTicketId);
        uint256 count = 0;
        for (uint256 i = 0; i < currentTicketId; i++) {
            if (_tickets[i].owner == owner) {
                ownedTickets[count++] = i;
            }
        }
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = ownedTickets[i];
        }
        return result;
    }

    // get claimable tickets id list of an address
    function viewClaimableTicketsOfAddress(
        address owner
    ) public view returns (uint256[] memory) {
        uint256[] memory ownedTickets = viewTicketsOfAddress(owner);
        uint256[] memory claimableTickets = new uint256[](ownedTickets.length);
        uint256 count = 0;
        for (uint256 i = 0; i < ownedTickets.length; i++) {
            uint256 bracket = _tickets[ownedTickets[i]].bracket;
            if (rewardsForBracket[bracket] > 0) {
                claimableTickets[count++] = ownedTickets[i];
            }
        }
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = claimableTickets[i];
        }
        return result;
    }

    function viewRewardsAmount(
        uint256[] memory _ticketIds
    ) public view returns (uint256) {
        if (status != Status.Claimable || _ticketIds.length == 0) {
            return 0;
        }
        uint256 reward = 0;
        for (uint256 i = 0; i < _ticketIds.length; i++) {
            reward += rewardsForBracket[_tickets[_ticketIds[i]].bracket];
        }
        return reward;
    }

    function viewMyRewardsAmount() external view returns (uint256) {
        return viewRewardsAmount(viewClaimableTicketsOfAddress(msg.sender));
    }

    /**
     * @notice Check if an address is a contract
     */
    function _isContract(address _addr) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(_addr)
        }
        return size > 0;
    }

    // these function should be deleted. Now they are used for testing
    function setEndTime(uint256 _endTime) external onlyOwner {
        endTime = _endTime;
    }

    function setEndRewardTime(uint256 _endRewardTime) external onlyOwner {
        endRewardTime = _endRewardTime;
    }

    function setStartTime(uint256 _startTime) external onlyOwner {
        startTime = _startTime;
    }
}
