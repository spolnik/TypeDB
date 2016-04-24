import {expect} from "chai";
import {TypeDB, Optional} from "../type-db";

describe("TypeDB", () => {

    let person = {name: "Mikolaj", age: 3};

    describe(`"#insert(${JSON.stringify(person)})`, () => {
        before(() => {
            this.db = new TypeDB();
        });

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