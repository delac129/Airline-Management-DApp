// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract AirlineManagement {
    struct Ticket {
        address owner;
        string destination;
        uint256 price;
        uint seat;
        string class;
        bool roundTrip;
        bool isAvailable;
        uint month;
    }

    address public ceo; //The CEO of the airlines
    string[] public destinations; //Array of the names of the destinations
    uint[] public destinationPrices; //Array of the prices for the destinations
    uint[] public seats; //Amount of seats for each destination
    mapping(string => uint) public indexes; //Gives the index of the destination by passing its name
    uint[12] public monthMultiplier; //The multiplier for each month
    uint[3] public classMultiplier; //The multipler for each class type?
    uint public count; //The number of destinations available
    bool public canPayout; //If the CEO can collect money
    uint public payAmount; //The amount the ceo can collect (30%)

    mapping(uint256 => Ticket) public ticketDetails;
    uint256 public nextTicketId;

    modifier restricted() {
        require(msg.sender == ceo);
        _;
    }

    // must create one destination
    constructor(string memory destination, uint256 destinationPrice) {
        ceo = msg.sender;
        canPayout = false;
        payAmount = 0;
        count = 0;
        destinations.push(destination);
        destinationPrices.push(destinationPrice);
        seats.push(30);
        indexes[destination] = count;
        create30Tickets(msg.sender, destination, destinationPrice);

        // Initialize monthMultiplier
        monthMultiplier[0] = 3;
        monthMultiplier[1] = 2;
        monthMultiplier[2] = 4;
        monthMultiplier[3] = 5;
        monthMultiplier[4] = 3;
        monthMultiplier[5] = 12;
        monthMultiplier[6] = 11;
        monthMultiplier[7] = 12;
        monthMultiplier[8] = 15;
        monthMultiplier[9] = 14;
        monthMultiplier[10] = 11;
        monthMultiplier[11] = 13;

        // Initialize classMultiplier
        classMultiplier[0] = 1;
        classMultiplier[1] = 2;
        classMultiplier[2] = 3;

        count++;
    }

    //Creates a destination
    function createDestination(string memory destination, uint destinationPrice) restricted public {
        require(keccak256(abi.encodePacked(destinations[indexes[destination]])) != keccak256(abi.encodePacked(destination)), "Error: This destination already exists!");
        require(destinationPrice > 30, "Error: Base price cannot be below 30 Wei!");
        create30Tickets(msg.sender, destination, destinationPrice);

        destinations.push(destination);
        destinationPrices.push(destinationPrice);
        indexes[destination] = count;
        seats.push(30);
        count++;
    }

    //creates 30 tickets for a destination
    function create30Tickets(address owner, string memory destination, uint256 price) private restricted {
        for (uint256 seat = 0; seat < 30; seat++) {
            uint256 tokenId = nextTicketId;
            ticketDetails[tokenId] = Ticket(owner, destination, price, seat, "", false, true, 0);
            nextTicketId++;
        }
    }

    function getPrice (string memory destination, uint month, uint class, bool way) public view returns(uint) {
        require(keccak256(abi.encodePacked(destinations[indexes[destination]])) == keccak256(abi.encodePacked(destination)), "Error: This destination doesn't exist!");        
        uint cm = classMultiplier[class - 1]; //class multiplier
        uint mm = monthMultiplier[month - 1]; //month multiplier

        uint price = destinationPrices[indexes[destination]] * cm;

        if(way)
            price *= 2;

        if(10 > mm)
            return price / mm;
        return price * (mm - 10);
    }

    function bookFlight(string memory destination, uint month, uint class, bool way) public payable{
        require(msg.value == getPrice(destination, month, class, way));
        require(keccak256(abi.encodePacked(destinations[indexes[destination]])) == keccak256(abi.encodePacked(destination)), "Error: This destination doesn't exist!");

        // finds an available ticket for the destination
        bool booked = false;
        for (uint tokenId = 0; tokenId < nextTicketId; tokenId++) {
            Ticket storage ticket = ticketDetails[tokenId];
            
            // makes sure its the same destination
            if (keccak256(abi.encodePacked(ticket.destination)) == keccak256(abi.encodePacked(destination)) && ticket.isAvailable) {
                
                // updates the ticket details
                ticket.owner = msg.sender;
                ticket.class = class == 1 ? "Economy" : class == 2 ? "Business" : "First";
                ticket.roundTrip = way;
                ticket.isAvailable = false;
                ticket.month = month;
                ticket.price = msg.value;

                booked = true;
                break;
            }
        }

        // no available ticket was found
        require(booked, "No available tickets for the specified destination");
        seats[indexes[destination]]--;

        payAmount += (msg.value);
        canPayout = true;
    }

    function isCeo(address user) public view returns(bool) {
        require(user == ceo, "You are not the CEO!");
        return true;
    } 

    function getBookedFlights(address user) public view returns (Ticket[] memory) {
        uint bookedCount = 0;

        // count the number of tickets owned by the user to know the size of the array
        for (uint tokenId = 0; tokenId < nextTicketId; tokenId++) {
            if (ticketDetails[tokenId].owner == user && !ticketDetails[tokenId].isAvailable) {
                bookedCount++;
            }
        }

        // Create an array of the to hold the booked tickets
        Ticket[] memory bookedTickets = new Ticket[](bookedCount);
        uint index = 0;

        // array with the booked tickets
        for (uint tokenId = 0; tokenId < nextTicketId; tokenId++) {
            if (ticketDetails[tokenId].owner == user && !ticketDetails[tokenId].isAvailable) {
                bookedTickets[index] = ticketDetails[tokenId];
                index++;
            }
        }

        return bookedTickets;
    }    

    function payCEO() public restricted {
        payable(ceo).transfer(payAmount * 9 / 10);
        canPayout = false;
        payAmount = 0;
    }
}
