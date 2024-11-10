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
    }

    address public ceo; //The CEO of the airlines
    string[] public destinations; //Array of the names of the destinations
    uint[] public destinationPrices; //Array of the prices for the destinations
    mapping(string => uint) indexes; //Gives the index of the destination by passing its name
    uint[12] public monthMultiplier; //The multiplier for each month
    uint[3] public classMultiplier; //The multipler for each class type?
    uint count; //The number of destinations available

    // for associating ticket with NFTs
    mapping(uint256 => Ticket) public ticketDetails;
    uint256 public nextTicketId;

    modifier restricted() {
        require(msg.sender == ceo);
        _;
    }

    // must create one destination
    constructor(string memory destination, uint256 destinationPrice) {
        ceo = msg.sender;
        count = 0;
        destinations.push(destination);
        destinationPrices.push(destinationPrice);
        indexes[destination] = count;
        create30Tickets(msg.sender, destination, destinationPrice);

        // Initialize monthMultiplier
        monthMultiplier[0] = 1;
        monthMultiplier[1] = 1;
        monthMultiplier[2] = 1;
        monthMultiplier[3] = 1;
        monthMultiplier[4] = 1;
        monthMultiplier[5] = 1;
        monthMultiplier[6] = 1;
        monthMultiplier[7] = 1;
        monthMultiplier[8] = 1;
        monthMultiplier[9] = 1;
        monthMultiplier[10] = 1;
        monthMultiplier[11] = 1;

        // Initialize classMultiplier
        classMultiplier[0] = 1;
        classMultiplier[1] = 1;
        classMultiplier[2] = 1;
    }

    //Creates a destination
    function createDestination(string memory destination, uint destinationPrice) restricted public {
        require(keccak256(abi.encodePacked(destinations[indexes[destination]])) != keccak256(abi.encodePacked(destination)));
        create30Tickets(msg.sender, destination, destinationPrice);
        }

    //creates 30 tickets for a destination
    function create30Tickets(address owner, string memory destination, uint256 price) public restricted {
        for (uint256 seat = 0; seat < 30; seat++) {
            uint256 tokenId = nextTicketId;
            ticketDetails[tokenId] = Ticket(owner, destination, price, seat, "", false, true);
            nextTicketId++;
        }
    }

    function getPrice (string memory destination, uint month, uint class, bool way) public view returns(uint) {
        uint price = destinationPrices[indexes[destination]] 
                * monthMultiplier[month - 1] 
                * classMultiplier[class - 1];

        if(way){return price * 2;}
        return price;
    }

    function bookFlight(string memory destination, uint month, uint class, bool way) public payable{
        require(msg.value == getPrice(destination, month, class, way));

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

                booked = true;
                break;
            }
        }

        // no available ticket was found
        require(booked, "No available tickets for the specified destination");
    }

    function isCeo(address user) public view returns(bool) {
        return user == ceo;
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

        // Populate the array with the booked tickets
        for (uint tokenId = 0; tokenId < nextTicketId; tokenId++) {
            if (ticketDetails[tokenId].owner == user && !ticketDetails[tokenId].isAvailable) {
                bookedTickets[index] = ticketDetails[tokenId];
                index++;
            }
        }

        return bookedTickets;
    }    
}