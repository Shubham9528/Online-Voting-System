### 🗳️ Online Voting System

Welcome to the Online Voting System project! This system allows organizations, institutions, and individuals to conduct secure and efficient elections online. Built with modern web technologies and secure backend logic, this project ensures a smooth and transparent voting process.


![landing page](https://github.com/user-attachments/assets/daada42f-bf8c-46df-ac77-72eb957bf3f6)


## 📋 Table of Contents


- [Landing Page](#Introduction)
- [Admin Module](#Features)
- [Registration Module](#Installation)
- [Voting System Module](#Usage)
- [Backend Server](#Running-Tests)

  
## 🏠 Landing Page

The landing page is the entry point for users to access different parts of the online voting system. It provides options for voters to log in, register, or for admins to log in.


## ✨Key Features

Introduction: Brief explanation of what the Online Voting System is.
Navigation Links: Links to login, register, or access the admin portal.

bash
```
<!-- HTML Structure -->
<div class="main">
    <!-- Left side with introduction and links -->
    <div class="left-body">
        <h1 class="logo"><span>Voting</span>System</h1>
        <h2 class="logo">What is <span>online Voting System</span>?</h2>
        <p>Explanation of the system.</p>
        <!-- Navigation Links -->
        <div class="link">Already have an account? <a href="/login">Login as Voter</a></div>
        <div class="link">Don't have an account? <a href="/register">Register as Voter</a></div>
        <div class="link">Administrator this site? <a href="/admin">Login as Admin</a></div>
    </div>
    <!-- Right side with an image -->
    <div class="right-body">
        <img src="images/2.jpeg">
    </div>
</div>

```

## 🔑 Admin Module
The admin module allows administrators to manage the voting process. This includes adding candidates and defining the voting period.
![admin login](https://github.com/user-attachments/assets/d59a7e87-d416-403c-b217-5691002f320b)

## ✨Key Features

Add Candidates: Admins can add candidates with their party details


Sudo
```
<!-- HTML Structure for Admin Portal -->
<div id="head" class="text-center">
    <h1>Decentralized Voting Using Ethereum Blockchain</h1>
</div>

<!-- Form to Add Candidates -->
<form class="container" action="/addCandidate" method="POST">
    <legend>Add Candidate</legend>  
    <table class="table text-center">
        <!-- Input for Candidate's Name and Party -->
        <tr>
            <th>Name</th>
            <td><input id="name" type="text" name="name" required></td>  
            <th>Party</th>
            <td><input id="party" type="text" name="party" required></td> 
        </tr>
    </table>
</form>

<!-- Form to Define Voting Dates -->
<form class="container">
    <legend>Define Voting Dates</legend>  
    <table class="table text-center">
        <!-- Input for Start and End Dates -->
        <tr>              
            <th>Start date</th>
            <td><input id="startDate" type="date" name="startdate" required></td>
            <th>End date</th>
            <td><input id="endDate" type="date" name="enddate" required></td>
        </tr>
    </table>
</form>
```

## 📝 Registration Module

This module allows new voters to register by providing their details, including their ID proof and contact information:
![voter regitration](https://github.com/user-attachments/assets/f7d2bd35-bc2e-40c9-8632-8b514fdecd33)

## ✨Key Features
Voter Registration: Collects essential voter details for registration.
ID Verification: Allows voters to choose their ID proof type

bash
```
npm start
```
Open your browser and navigate to http://localhost:3000 to see the application in action.

## 🧪 Running Tests
This project uses @testing-library/react for testing. To run the tests, use the following command:

Sudo
```
<!-- HTML Structure for Voter Registration -->
<form action="/register" method="POST">
    <div class="form">
        <!-- Input for First and Last Name -->
        <label>Firstname:</label>
        <input type="text" name="fname" required>
        
        <label>Lastname:</label>
        <input type="text" name="lname" required>

        <!-- Dropdown for ID Proof Selection -->
        <label>Choose ID Proof:</label>
        <select name="idname">
            <option value="Aadhar">Aadhar</option>
            <option value="Pan Card">Pan Card</option>
            <!-- Other Options -->
        </select>

        <!-- Input for ID Number -->
        <label>ID No:</label>
        <input type="text" name="idnum" required>

        <!-- Input for Institute ID, DOB, Gender, Phone, and Address -->
        <label>Institute Id No:</label>
        <input type="text" name="instidnum" required>
        <!-- Other Inputs -->

        <!-- Registration Button -->
        <button name="register">Register</button>
    </div>
</form>

```
## 🗳️ Voting System Module

Candidate Selection: Voters can view and select a candidate to vote for.
![voting page](https://github.com/user-attachments/assets/d1677126-0216-45a0-a6ec-e3b6cb3f95a3)

## ✨Key Features
Voter Registration: Collects essential voter details for registration.
Vote Submission: Once a candidate is selected, voters can submit their vote.

``` Code
<!-- HTML Structure for Voting -->
<form id="candidate" class="container" action="/voteCount" method="POST">
    <table class="table text-center">
        <thead>
            <!-- Display Candidates and Their Parties -->
            <tr>
                <th>Name</th>
                <th>Party</th>
            </tr>
            <!-- Candidate List Generated Dynamically -->
            <% votingData.forEach(data => { %>
                <tr>
                    <td><input type="radio" name="candidate" value="<%= data.candidate_name %>">
                        <label><%= data.candidate_name %></label></td>
                    <td><%= data.party_name %></td>
                </tr>
            <% }) %>
        </thead>
    </table>
    <!-- Vote Button -->
    <button id="voteButton" onclick="App.vote()">Vote</button>
</form>

```

## 🛠️ Backend Server

The backend server handles all the database operations, API routes, and logic to support the online voting system. It is built using Node.js, Express.js, and PostgreSQL.
![database](https://github.com/user-attachments/assets/c1805c78-3587-4459-af6a-0e62adaf98d3)



## ✨Key Features
Voter Registration: Stores voter details in the database.
Admin Login: Authenticates admin users.
Candidate Management: Adds candidates and manages their information.
Voting Logic: Handles the voting process and vote counting.

``` Sudo
import express from "express";
import bodyParser from "body-parser";
import uniqueId from "generate-unique-id";
import pg from "pg";

const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// PostgreSQL Database Connection
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "voting system",
    password: "Shubham@123",
    port: 5432,
});
db.connect();

// Register Functionality
async function register(FirstName, LastName, idNumber, instituteId, dob, gender, phone, address, votecount) {
    try {
        const voter_id = uniqueId({ length: 11, useLetters: false });
        await db.query("INSERT INTO register VALUES($1,$2,...)", [FirstName, LastName, idNumber, ...]);
    } catch (err) {
        console.log(err);
    }
}

// Admin Login Functionality
async function adminLogin(email, password) {
    try {
        const result = await db.query("SELECT * FROM adminLogin WHERE email = $1 AND password = $2", [email, password]);
        return result.rows.length > 0;
    } catch (err) {
        console.log(err);
    }
}

// Add Candidate Functionality
async function addCandidate(name, party, stdate, endate) {
    try {
        await db.query("INSERT INTO addCandidate VALUES($1, $2, $3, $4)", [name, party, stdate, endate]);
        await db.query("INSERT INTO votecount VALUES($1, $2)", [name, party]);
    } catch (err) {
        console.log(err);
    }
}

// Server Initialization
app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
});


```

# 🗳️ Online Voting System

This project is a secure  online voting system, built using Node.js, Express.js, and PostgreSQL.

## 🏗️ How to Set Up the Project

## 1. Clone the Repository

```bash
git clone https://github.com/your-repo/online-voting-system.git
```
## 2.  Install Dependencies
Navigate to the project directory and install the required dependencies:
```bash
npm install

```
## 3.  Install Dependencies
Create a new PostgreSQL database named voting system:
Update the database credentials in the backend server script.
```bash
const db = new pg.Client({
    user: "your-username",
    host: "localhost",
    database: "voting system",
    password: "your-password",
    port: 5432,
});


```
## 4.Run the Application
bash
```
npm start
```

## 5. Access the Application
Open your browser and navigate to:
```bash
http://localhost:3000
```





## 🤝 Contributing

Contributions are welcome! If you have any ideas or suggestions to improve the project, feel free to open an issue or submit a pull request.

## 📄 License

This project is licensed under the -- License. See the LICENSE file for more details.

## 🙏 Acknowledgements

Thanks to the bootstrap teams for their amazing libraries and tools.

