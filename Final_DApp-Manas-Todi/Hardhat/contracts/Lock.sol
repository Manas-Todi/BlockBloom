// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Election {
    struct Candidate {
        uint id;
        string name;
        uint rollNumber;
        uint voteCount;
    }

    mapping(uint => Candidate) private candidates;

    mapping(address => bool) private voters;

    uint private candidates_count;
    address private owner;

    constructor() {
        owner = msg.sender; // Set the contract deployer as the owner
    }
    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner!");
        _;
    }
    function Add_Candidate(string memory _name, uint _rollNumber) public onlyOwner {
        candidates_count++;
        candidates[candidates_count] = Candidate(candidates_count, _name, _rollNumber, 0);
    }
    function vote(uint _rollNumber) public {
        require(!voters[msg.sender], "You have already voted.");
        uint candidateId = 0;
        bool validCandidate = false;
        
        for (uint i = 1; i <= candidates_count; i++) {
            if (candidates[i].rollNumber == _rollNumber) {
                candidateId = i;
                validCandidate = true;
                break;
            }
        }
        require(validCandidate, "Invalid candidate roll number.");
        voters[msg.sender] = true;

        candidates[candidateId].voteCount++;
    }

    function Votes_for_candidate(uint _rollNumber) public view returns (uint voteCount) {
        for (uint i = 1; i <= candidates_count; i++) {
            if (candidates[i].rollNumber == _rollNumber) {
                return candidates[i].voteCount; // Return the vote count if roll number matches
            }
        }

        revert("Candidate with this roll number does not exist.");
    }
    function Show_all_candidates() public view returns (Candidate[] memory) {
        Candidate[] memory allCandidates = new Candidate[](candidates_count);
        for (uint i = 1; i <= candidates_count; i++) {
            allCandidates[i - 1] = candidates[i];
        }
        return allCandidates;
    }
}
