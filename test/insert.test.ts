import {expect} from "chai";
import {TypeDB} from "../index";
import * as fs from "fs";
import {Optional} from "../lib/optional";

describe("TypeDB (file based)", () => {

    let person = {name: "Mikolaj", age: 3};

    let testCases = [
        {
            name: "inmemory",
            setup: () => {
                this.db = new TypeDB();
            }
        },
        // {
        //     name: "file based",
        //     setup: () => {
        //         let dbName = "test/tmp/insert.test.json";
        //
        //         if (fs.existsSync(dbName)) {
        //             fs.unlinkSync(dbName);
        //         }
        //
        //         this.db = new TypeDB(dbName);
        //     }
        // }
    ];

    testCases.forEach((testCase) => {
        describe(`"#insert(${JSON.stringify(person)}) [${testCase.name}]`, () => {

            before(testCase.setup);

            it("should insert new object into db", () => {
                let item = this.db.insert(person);
                expect(item).to.eql(person);
            });

            it("allows later on querying inserted object", () => {
                let item = this.db.findFirst((person: {name: string}) => person.name === "Mikolaj");
                expect(item.value).to.eql(person);
            });
        });
    });
});