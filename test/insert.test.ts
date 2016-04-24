import {expect} from "chai";
import {TypeDB, Optional} from "../index";
import * as fs from "fs";


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
                let dbName = "insert.filebased.test.json";

                if (fs.existsSync(dbName)) {
                    fs.unlinkSync(dbName);
                }

                this.db = new TypeDB(dbName);
            }
        }
    ];

    testCases.forEach((testCase) => {
        before(testCase.setup);

        describe(`"#insert(${JSON.stringify(person)}) [${testCase.name}]`, () => {

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