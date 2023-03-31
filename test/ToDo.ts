import hre from 'hardhat'

describe("ToDo", function () {
    before(async function() {
        // Run once before the first test
        const ToDo = await hre.ethers.getContractFactory('ToDo');
        const toDo = await ToDo.deploy();
    });

    describe("Create a task", function() {
        it("with the right params", function () {

        })

        it("without description",  function() {

        })

        it("without title", function() {
            
        })
    });

    describe("Edit a task and sender is the owner", function() {
        it("with the right params", function() {

        })

        it("task does not exist", function() {

        })

        it("without id param", function() {

        })

        it("without deleted param", function() {

        })

        it("without finished param", function() {

        })

        it("without description param", function() {

        })

        it("without title param", function() {

        })

        it("without change task", function() {

        })
    });

    describe("Edit a task and sender is not the owner", function() {
        it("", function(){

        });
    });

    describe("Get task data", function() {
        it("by id and sender is the owner", function() {

        });

        it("by id and sender is not the owner", function() {

        });

        it("id task does not exist", function() {

        });
    })
})