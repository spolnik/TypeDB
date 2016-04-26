import {expect} from "chai";
import {TypeDB} from "../index";
import * as fs from "fs";

describe("TypeDB", () => {

    let person = {name: "Mikolaj", age: 3};
    let person3 = { name: "Julia", age: 7};

    let testCases = [
        {
            name: "inmemory",
            setup: () => {
                this.db = new TypeDB();
                this.db.insert(person);

                let person2 = Object.assign({}, person, {name: "Tom"});
                this.db.insert(person2);
                this.db.insert(person3);
            }
        },
        // {
        //     name: "file based",
        //     setup: () => {
        //         let dbName = "test/tmp/findAll.test.json";
        //
        //         if (fs.existsSync(dbName)) {
        //             fs.unlinkSync(dbName);
        //         }
        //
        //         this.db = new TypeDB(dbName);
        //         this.db.insert(person);
        //
        //         let person2 = Object.assign({}, person, {name: "Tom"});
        //         this.db.insert(person2);
        //         this.db.insert(person3);
        //     }
        // }
    ];

    testCases.forEach((testCase) => {

        describe(`#findAll(predicate) [${testCase.name}]`, () => {

            before(testCase.setup);

            it("should findFirst two objects which where inserted to database, and which have age set to 3", () => {
                let items = this.db.findAll((person: {age: number}) => person.age === 3);
                expect(items).to.have.length(2);
            });

            it("should findFirst only one object which has name set to Julia", () => {
                let items = this.db.findAll((person: {name: string}) => person.name === "Julia");
                expect(items[0]).to.eql(person3);
            });

            it("findFirst all without argument retrieves all inserted items", () => {
                let items = this.db.findAll();
                expect(items).to.have.length(3);
            });
        });
    });
});