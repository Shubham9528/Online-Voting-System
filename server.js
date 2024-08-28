import express from "express";
import bodyParser from "body-parser";
import uniqueId from "generate-unique-id";
import bcrypt from "bcrypt";
import pg from "pg";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// PostgreSQL database connection configuration
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "voting system",
    password: "Shubham@123",
    port: 5432,
});

db.connect(); // Establish connection to the database

let idNo; // Variable to store ID number globally

// Function to register a new voter with encrypted voter_id and phone
async function register(FirstName, LastName, idNumber, instituteId, dob, gender, phone, address, votecount) {
    try {
        // Generate a unique voter_id
        const voter_id = uniqueId({
            length: 11,
            useLetters: false
        });

        const saltRounds = 10;
        
        // Encrypt the voter_id and phone number
        const hashedVoterId = await bcrypt.hash(voter_id, saltRounds);
        const hashedPhone = await bcrypt.hash(phone, saltRounds);

        // Insert the new voter into the database with the encrypted details
        await db.query("INSERT INTO register VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)", 
            [FirstName, LastName, idNumber, instituteId, dob, gender, hashedPhone, address, hashedVoterId, votecount]);

    } catch (err) {
        console.log(err);
        res.send(err);
    }
}

// Function to handle admin login
async function adminLogin(email, password) {
    try {
        const result = await db.query("SELECT * FROM adminLogin WHERE email = $1 AND password = $2", [email, password]);
        return result.rows.length > 0;
    } catch (err) {
        console.log(err);
    }
}

// Function to add a new candidate to the system
async function addCandidate(name, party, stdate, endate) {
    try {
        await db.query("INSERT INTO addCandidate VALUES($1,$2,$3,$4)", [name, party, stdate, endate]);
        await db.query("INSERT INTO votecount VALUES($1,$2)", [name, party]);
    } catch (err) {
        console.log(err);
    }
}

// Route to render the homepage
app.get("/", (req, res) => {
    res.render("index.ejs");
});

// Route to render the registration page
app.get("/register", (req, res) => {
    res.render("registration.ejs");
});

// Route to handle the voting process
app.post("/voting-system", async (req, res) => {
    const InputidNo = req.body.idNo; // Extract ID number from request
    const voterId = req.body.voterId; // Extract voter ID from request
    const phone = req.body.phone;     // Extract phone number from request
    idNo = InputidNo;                 // Store ID number globally
    
    try {
        // Retrieve the encrypted phone number and voter ID from the database
        const result = await db.query("SELECT phone_number, voter_id FROM register WHERE id_no = $1", [idNo]);

        if (result.rows.length > 0) {
            const hashedPhone = result.rows[0].phone_number;
            const hashedVoterId = result.rows[0].voter_id;
                
            // Compare the plaintext phone number and voter ID with the hashed versions
            const isPhoneMatch = await bcrypt.compare(phone, hashedPhone);
            const isVoterIdMatch = await bcrypt.compare(voterId, hashedVoterId);

            if (isPhoneMatch && isVoterIdMatch) {
                // If both match, fetch the candidate data and render the voting page
                const partyData = await db.query("SELECT candidate_name, party_name FROM addCandidate");
                res.render("voting-system.ejs", { votingData: partyData.rows });
            } else {
                // If either doesn't match, redirect to the login page
                res.redirect("/login");
            }
        } else {
            // If no matching record is found, redirect to the login page
            res.redirect("/login");
        }
    } catch (err) {
        res.send("Not voted");
        console.log(err);
    }
});

// Route to handle voter registration
app.post("/register", async (req, res) => {
    const FirstName = req.body.fname;
    const LastName = req.body.lname;
    const idName = req.body.idname;
    const idNumber = req.body.idnum;
    const instituteId = req.body.instidnum;
    const dob = req.body.dob;
    const gender = req.body.gender;
    const phone = req.body.phone;
    const address = req.body.address;
    const vote = 1;

    try {
        await register(FirstName, LastName, idNumber, instituteId, dob, gender, phone, address, vote);
    } catch (err) {
        console.log(err);
    }
    
    res.redirect("/");
});

// Route to handle admin login
app.post('/adminLogin', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const result = await adminLogin(email, password);
    
    if(result) {
        res.render("admin.ejs");
    } else {
        res.send("Error Login");
    }
});

// Route to render the page for adding a candidate
app.get("/addCandidate", (req, res) => {
    res.render("admin.ejs");
});

// Route to handle adding a candidate
app.post("/addCandidate", async(req, res) => {
    const name = req.body.name;
    const party = req.body.party;
    const stdate = req.body.startdate;
    const endate = req.body.enddate;
    
    await addCandidate(name, party, stdate, endate);
    res.redirect("/addCandidate");
});

// Route to handle vote counting
app.post('/voteCount', async (req, res) => {
    const name = req.body.candidate;
    const isVoted = await db.query("SELECT votecount FROM register WHERE id_no = $1", [idNo]);

    if (isVoted.rows[0].votecount != 0) {
        await db.query("UPDATE votecount SET total_votes = total_votes + 1 WHERE candidate_name = $1", [name]);
        await db.query("UPDATE register SET votecount = 0 WHERE id_no = $1", [idNo]);
        
        res.send("<h1 style='color: green; text-align: center;'>Voted Successfully!!!</h1>");
    } else {
        res.send("<h1 style='color: red; text-align: center;'>Already Voted!!!</h1>");
    }
});

// Route to render the login page
app.get("/login", (req, res) => {
    res.render("login.ejs");
});

// Route to render the admin login page
app.get("/admin", (req, res) => {
    res.render("adminLogin.ejs");
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
});
