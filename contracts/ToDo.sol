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

    modifier checkIfTaskExitAndSenderIsTheOwner(uint256 _id) {
        require(_id < tasks.length, "There is no task with this id.");
        require(msg.sender == taskToOwner[_id], "You are not the owner of this task.");
        _;
    }

    modifier checkIfStringIsEmpty(string memory _text) {
        bytes memory _textBytes = bytes(_text);
        require(_textBytes.length > 0, "Text is empty.");
        _;
    }

    function getAllTaskByOwner() view public returns(Task[] memory) {
        require(ownerTaskCount[msg.sender] > 0, "This owner does not have any task.");

        address _owner = msg.sender;

        uint256 _counterOfTasks = 0;
        Task[] memory tasksList = new Task[](ownerTaskCount[_owner]);

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

    function getTaskById(uint256 _id) view public checkIfTaskExitAndSenderIsTheOwner(_id) returns(Task memory) {
        return tasks[_id];
    }

    function createNewTask(string memory _description, string memory _title) public checkIfStringIsEmpty(_description) checkIfStringIsEmpty(_title) {
        address _owner = msg.sender;
        tasks.push(Task(false, false, _description, _title));
        uint id = tasks.length - 1;
        taskToOwner[id] = _owner;
        ownerTaskCount[_owner]++;
        // emit SendTasks(getAllTaskByOwner());
    }

    function editTask(uint _id, bool _deleted, bool _finished, string memory _description, string memory _title) public checkIfTaskExitAndSenderIsTheOwner(_id) {
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