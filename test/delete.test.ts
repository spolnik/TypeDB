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
        {
            name: "file based",
            setup: () => {
                let dbName = "test/delete.test.json";

                if (fs.existsSync(dbName)) {
                    fs.unlinkSync(dbName);
                }

                this.db = new TypeDB(dbName);
                this.db.insert(person);
            }
        }
    ];

    testCases.forEach((testCase) => {

        describe(`#delete(predicate) [${testCase.name}]`, () => {

            before(testCase.setup);

            it("should delete existing object based on any field (remove just first item)", (done) => {
                this.db.removeFirst((person: {name: string}) => person.name === "Mikolaj")
                    .then((removedItem: Optional<{name: string}>) => {
                        expect(removedItem.value.name).to.be.equal("Mikolaj");

                        this.db.findFirst((person: {name: string}) => person.name === "Mikolaj")
                            .then((data: Optional<any>) => {
                                expect(data.isEmpty).to.eql(true);
                                done();
                            });
                    });
            });
        });
    });
});