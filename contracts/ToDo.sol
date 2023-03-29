// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract ToDo {
    struct Task {
        bool deleted;
        bool finished;
        string description;
        string title;
    }
    
    Task[] private tasks;

    mapping(uint256 => address) taskToOwner;
    mapping(address => uint) ownerTaskCount;

    event SendTasks(Task[] tasks);
    event SendModifiedTask(Task task);

    function getAllTaskByOwner(address _owner) view public returns(Task[] memory) {
        // Check if owner has any task
        uint256 _counterOfTasks = 0;
        Task[] memory tasksList;

        for (uint256 i = 0; i < tasks.length; i++) {
            if (_counterOfTasks == ownerTaskCount[_owner]) {
                break;
            }

            if (taskToOwner[i] == _owner) {
                tasksList[_counterOfTasks] = tasks[i];
            }
        }
        
        return tasksList;
    }

    function getTaskById(uint256 _id, address _owner) view public returns(Task memory) {
        // Check if the task exists and the owner is the sender
        return tasks[_id];
    }

    function createNewTask(string memory _description, string memory _title) public  {
        address _owner = msg.sender;
        tasks.push(Task(false, false, _description, _title));
        uint id = tasks.length - 1;
        taskToOwner[id] = _owner;
        ownerTaskCount[_owner]++;
        emit SendTasks(getAllTaskByOwner(_owner));
    }

    function editTask(uint _id, bool _deleted, bool _finished, string memory _description, string memory _title) public {
        // Check if the task exists and the owner is the sender
        if (tasks[_id].deleted != _deleted) {
            tasks[_id].deleted = _deleted;
        }
        if(tasks[_id].finished != _finished) {
            tasks[_id].finished = _finished;
        }
        if (keccak256(abi.encode(tasks[_id].description)) != keccak256(abi.encode(_description))) {
            tasks[_id].description = _description;
        }
        if (keccak256(abi.encode(tasks[_id].title)) != keccak256(abi.encode(_title))) {
            tasks[_id].title = _title;
         }
    }

}