
export class TypeDB {

    private inMemory: any[] = [];

    insert<T>(obj: T): Promise<T> {
        return new Promise<T>((accept, reject) => {
            this.inMemory.push(obj);
            accept(obj);
        });
    }
    
    find<T>(predicate: (data: T) => boolean): Promise<T> {
        return new Promise<T>((accept, reject) => {
            let obj = this.inMemory.find(predicate);
            accept(obj);
        });
    }
}