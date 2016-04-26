import {expect} from "chai";
import {TypeDB} from "../index";
import * as fs from "fs";
import {Optional} from "../lib/optional";

describe("TypeDB", () => {

    let person = {name: "Mikolaj", age: 3};

    let testCases = [
        {
            name: "inmemory",
            setup: () => {
                this.db = new TypeDB();
                this.db.insert(person);
            }
        },
        // {
        //     name: "file based",
        //     setup: () => {
        //         let dbName = "test/tmp/findFirst.test.json";
        //
        //         if (fs.existsSync(dbName)) {
        //             fs.unlinkSync(dbName);
        //         }
        //
        //         this.db = new TypeDB(dbName);
        //         this.db.insert(person);
        //     }
        // }
    ];

    testCases.forEach((testCase) => {

        describe(`#findFirst(predicate) [${testCase.name}]`, () => {

            before(testCase.setup);

            it("should findFirst object based on any field", () => {
                let item = this.db.findFirst((person: {age: number}) => person.age === 3);
                expect(item.value).to.eql(person);
            });

            it("should return Absent in case of no object is found", () => {
                let item = this.db.findFirst((person: {name: string}) => person.name === "dummy");
                expect(item.isEmpty).to.eql(true);
            });
        });
    });
});