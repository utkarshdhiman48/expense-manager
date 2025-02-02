# Expense Manager

To run this project:

1. Install all the node modules using
   ```
   npm install
   ```
2. Get a latest copy of `.env` or create your own from `.env.example`
3. Start the project:
   - in dev server using
     ```
     npm start
     ```
   - using a debugger
     - Simply go to vs code run and debug panel and run as `Node: Nodemon`, this will run the project with a attached debugger.
     - Click before line no to add a red dot, this will be a breakpoint.
     - Nodemon will automatically refresh on new changes.
       > however this will be slower as compared to running project using `npm start`, but useful information is available if breakpoints are placed nicely.

# Entities and relations

```mermaid
classDiagram
    direction LR
    class User {
        name: string
        email: string
        password: string
        phone: string
        createdAt: Date
        groups: string[]
    }
    class Group {
        name: string
        members: string[]
        createdBy: string
        createdAt: Date
        updatedAt: Date
    }
    class Connection {
        user1: string
        user2: string
        createdAt: Date
    }
    class Transaction {
        title: string
        amount: number
        description: string
        createdBy: string
        distribution: Distribution[]
        type: string
        createdAt: Date
        updatedAt: Date
        updatedBy: string
        groupId: string
    }
    class Distribution {
        amount: number
        person: string
    }

    User "1" -- "0..*" Group : "groups"
    User "1" -- "0..*" Connection : "user1"
    User "1" -- "0..*" Connection : "user2"
    User "1" -- "0..*" Transaction : "createdBy"
    Group "1" -- "0..*" Transaction : "groupId"
    Transaction "1" -- "0..*" Distribution : "distribution"
    Distribution "1" -- "1" User : "person"
```
