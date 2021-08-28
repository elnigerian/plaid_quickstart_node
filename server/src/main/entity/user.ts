
export class User {
    // username: string;
    id: string = "ajdbflwierhfdbwaede";

    readonly objectType: string = "user";

    async find () {
        console.log("This is the find method on the User object");
        return this;
    }
}

