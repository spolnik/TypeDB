import {expect} from "chai";
import {TypeDB, Optional} from "../index";
import * as fs from "fs";

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
        {
            name: "file based",
            setup: () => {
                let dbName = "findFirst.test.json";

                if (fs.existsSync(dbName)) {
                    fs.unlinkSync(dbName);
                }

                this.db = new TypeDB(dbName);
                this.db.insert(person);
            }
        }
    ];

    testCases.forEach((testCase) => {

        describe(`#findFirst(predicate) [${testCase.name}]`, () => {

            before(testCase.setup);

            it("should findFirst object based on any field", (done) => {
                this.db.findFirst((person: {age: number}) => person.age === 3)
                    .then((data: Optional<{name: string, age: number}>) => {
                        expect(data.value).to.eql(person);
                        done();
                    });
            });

            it("should return Absent in case of no object is found", (done) => {
                this.db.findFirst((person: {name: string}) => person.name === "dummy")
                    .then((data: Optional<any>) => {
                        expect(data.isEmpty).to.eql(true);
                        done();
                    });
            });
        });
    });
});