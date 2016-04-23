import {fail} from "assert";
import {expect} from "chai";
import {TypeDB} from "../src/TypeDB";

describe("TypeDB", () => {

    let person = { name: "Mikolaj", age: 3};

    before(() => {
        this.db = new TypeDB();
    });

    describe(`"#insert(${JSON.stringify(person)})`, () => {
        it("should save new object into db", (done) => {
            this.db.insert(person)
                .then((data: {name: string, age: number}) => {
                    expect(data).to.eql(person);
                    done();
                });
        });

        it("allows later on querying inserted object", (done) => {
            this.db.find((person: {name: string}) => person.name === "Mikolaj")
                .then((data: {name: string, age: number}) => {
                    expect(data).to.eql(person);
                    done();
                });
        });
    });
});