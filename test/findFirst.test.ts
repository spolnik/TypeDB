import {expect} from "chai";
import {TypeDB, Optional} from "../type-db";

describe("TypeDB", () => {

    let person = {name: "Mikolaj", age: 3};

    before(() => {
        this.db = new TypeDB();
        this.db.insert(person);
    });

    describe("#findFirst(predicate)", () => {

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