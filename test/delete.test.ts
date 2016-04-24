import {expect} from "chai";
import {TypeDB, Optional} from "../index";

describe("TypeDB", () => {

    let person = {name: "Mikolaj", age: 3};

    before(() => {
        this.db = new TypeDB();
        this.db.insert(person);
    });

    describe("#delete(predicate)", () => {
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