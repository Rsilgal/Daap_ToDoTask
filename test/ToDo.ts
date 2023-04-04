import hre, { ethers } from 'hardhat'
import { ToDo } from '../typechain-types';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

describe("ToDo", function () {

    let contract : ToDo;
     let owner : SignerWithAddress;
     let otheraccount : SignerWithAddress;

     function getTaskProperties() {
        return {
            description :'Descripción de la tarea',
            title: '#1 Titulo de una tarea',
            deleted: false,
            finished: false
        }
     }

    beforeEach(async function() {
        [ owner, otheraccount ] = await ethers.getSigners();
        const ToDo = await ethers.getContractFactory('ToDo');
        contract = await ToDo.deploy();

    })

    describe("Create a task",  function() {
        it("with the right params", async function () {
            let task = getTaskProperties();
            await expect(contract.connect(owner).createNewTask(task.description, task.title)).to.not.reverted;

        })

        it("should revert with message 'Description must not be empty.', when description is empty", async function() {
            let task = getTaskProperties();

            task.description = '';

            await expect(contract.createNewTask(task.description, task.title)).to.be.revertedWith("Text is empty.")

        })

        it("without title", async function() {
            let task = getTaskProperties();

            task.title = '';
            
            await expect(contract.createNewTask(task.description, task.title)).to.be.revertedWith("Text is empty.")
        })
    });

    describe("Get task data", function() {
        it("by id and sender is the owner", async function() {
            let task = getTaskProperties();
            await contract.connect(owner).createNewTask(task.description, task.title);

            const createdTask = await contract.getTaskById(0);

            expect(createdTask.description).to.equal(task.description);
            expect(createdTask.title).to.equal(task.title);
            expect(createdTask.deleted).to.equal(task.deleted);
            expect(createdTask.finished).to.equal(task.finished);
        });

        it("by id and sender is not the owner", async function() {
            let task = getTaskProperties();
            await contract.connect(owner).createNewTask(task.description, task.title);

            await expect(contract.connect(otheraccount).getTaskById(0)).to.revertedWith("You are not the owner of this task.")
        });

        it("id task does not exist", async function() {
            await expect(contract.connect(owner).getTaskById(0)).to.revertedWith("There is no task with this id.");
        });

        // TODO: Change this test. It does not covered when the owner has some task
        it("Get all my tasks", async function () {
            let task = getTaskProperties();
            await contract.connect(owner).createNewTask(task.description, task.title);
            await contract.connect(owner).createNewTask(task.description, task.title);
            
            let tasks = await contract.connect(owner).getAllTaskByOwner();
            
            expect(tasks.length).to.be.equal(2);
        })

        it("should revert with message 'This owner does not have any task.', when i dont have any task.", async function () {
            await expect(contract.getAllTaskByOwner()).to.revertedWith("This owner does not have any task.");
        })
    })

    describe("Edit task data", function() {
        it("edit without changes", async function() {
            const taskData = getTaskProperties();
            await contract.createNewTask(taskData.description, taskData.title);

            const editedTask = await contract.getTaskById(0);
            expect(editedTask.deleted).to.be.equal(taskData.deleted);
            expect(editedTask.finished).to.be.equal(taskData.finished);
            expect(editedTask.description).to.be.equal(taskData.description);
            expect(editedTask.title).to.be.equal(taskData.title);
        });

        it("change finished to TRUE", async function() {
            const taskData = getTaskProperties();
            await contract.createNewTask(taskData.description, taskData.title);

            await contract.editTask(0, taskData.deleted, true, taskData.description, taskData.title);
            const editedTask = await contract.getTaskById(0);
            expect(editedTask.finished).to.be.equal(true);
        });

        it("change deleted to TRUE", async function() {
            const taskData = getTaskProperties();
            await contract.createNewTask(taskData.description, taskData.title);

            await contract.editTask(0, true, taskData.finished, taskData.description, taskData.title);
            const editedTask = await contract.getTaskById(0);
            expect(editedTask.deleted).to.be.equal(true);
        });

        it("change description to 'New Description'", async function() {
            const taskData = getTaskProperties();
            await contract.createNewTask(taskData.description, taskData.title);

            await contract.editTask(0, taskData.deleted, taskData.finished, "New Description", taskData.title);
            const editedTask = await contract.getTaskById(0);
            expect(editedTask.description).to.be.equal("New Description");
        });

        it("change title to 'New Title'", async function() {
            const taskData = getTaskProperties();
            await contract.createNewTask(taskData.description, taskData.title);

            await contract.editTask(0, taskData.deleted, taskData.finished, taskData.description, 'New Title');
            const editedTask = await contract.getTaskById(0);
            expect(editedTask.title).to.be.equal("New Title");
        });

        it("change title to 'New Title' and finished to TRUE", async function() {
            const taskData = getTaskProperties();
            await contract.createNewTask(taskData.description, taskData.title);

            await contract.editTask(0, taskData.deleted, true, taskData.description, 'New Title');
            const editedTask = await contract.getTaskById(0);
            expect(editedTask.finished).to.be.equal(true);
            expect(editedTask.title).to.be.equal("New Title");
        });

        it("should revert with message 'There is no task with this id.', when id does not exist", async function() {
            const taskData = getTaskProperties();
            await contract.createNewTask(taskData.description, taskData.title);

            await expect(contract.editTask(10, taskData.deleted, true, taskData.description, taskData.title)).to.rejectedWith("There is no task with this id.");
        });

        it("should revert with message 'You are not the owner of this task.', when owner have not this task.", async function() {
            const taskData = getTaskProperties();
            await contract.connect(owner).createNewTask(taskData.description, taskData.title);

            await expect(contract.connect(otheraccount).editTask(0, taskData.deleted, true, taskData.description, taskData.title)).to.rejectedWith("You are not the owner of this task.");
        });
    })
})