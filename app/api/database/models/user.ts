class User {
    id: string;
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    isAdmin: boolean;
    constructor({
      id,
      username,
      email,
      password,
      firstName,
      lastName,
      isAdmin,
    }: {
      id: string;
      username: string;
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      isAdmin: boolean;
    }) {
      this.id = id;
      this.username = username;
      this.email = email;
      this.password = password;
      this.firstName = firstName;
      this.lastName = lastName;
      this.isAdmin = isAdmin;
    }
  }
  
 export default User;