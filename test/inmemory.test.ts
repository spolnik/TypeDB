import {expect} from "chai";
import {TypeDB, Optional} from "../src/TypeDB";

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

    describe('#findFirst(predicate)', () => {
        before(() => {
            this.db = new TypeDB();
            this.db.insert(person);
        });

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
        })
    });

    describe("#delete(predicate)", () => {
        before(() => {
            this.db = new TypeDB();
            this.db.insert(person);
        });

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