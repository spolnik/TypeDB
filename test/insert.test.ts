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
        {
            name: "file based",
            setup: () => {
                let dbName = "test/insert.test.json";

                if (fs.existsSync(dbName)) {
                    fs.unlinkSync(dbName);
                }

                this.db = new TypeDB(dbName);
            }
        }
    ];

    testCases.forEach((testCase) => {
        describe(`"#insert(${JSON.stringify(person)}) [${testCase.name}]`, () => {

            before(testCase.setup);

            it("should insert new object into db", (done) => {
                this.db.insert(person)
                    .then((data: {name: string, age: number}) => {
                        expect(data).to.eql(person);
                        done();
                    });
            });

            it("allows later on querying inserted object", (done) => {
                this.db.findFirst((person: {name: string}) => person.name === "Mikolaj")
                    .then((data: Optional<{name: string, age: number}>) => {
                        expect(data.value).to.eql(person);
                        done();
                    });
            });
        });
    });
});