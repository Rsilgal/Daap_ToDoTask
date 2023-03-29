// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract ToDo {
    struct Task {
        bool deleted;
        bool finished;
        string description;
        string title;
    }

    mapping(address => Task[]) private taskList;
}