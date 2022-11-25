// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21;

contract TaskContract {
    event AddTask(address reipient, uint taskId);
    event DeleteTask(uint taskId, bool isDeleted);

    struct Task {
        uint id;
        string taskText;
        bool isDeleted;
    }
    Task[] private tasks;
    mapping(uint256 => address) taskOwner;
    
    // adding task functions...
    function addTask(string memory taskText, bool isDeleted) external payable{
        uint taskId = tasks.length;
        tasks.push(Task(taskId, taskText, isDeleted));
        taskOwner[taskId] = msg.sender;
        emit AddTask(msg.sender, taskId);
    }

    function getMyTasks() external view returns(Task[] memory){
        Task[] memory temporary = new Task[](tasks.length);
        uint counter = 0;
        for(uint i=0; i<tasks.length; i++){
            if(taskOwner[i] == msg.sender && tasks[i].isDeleted == false){
                temporary[counter] = tasks[i];
                counter++ ;
            }
        }

        Task[] memory result = new Task[](counter);
        for(uint i = 0; i<counter ; i++){
            result[i] = temporary[i];
        }
        return result;
    }
    function deleteTask (uint taskId, bool isDeleted) external payable{
        if(taskOwner[taskId] == msg.sender){
            tasks[taskId].isDeleted = isDeleted;
            emit DeleteTask(taskId, isDeleted);
        }
    }
}