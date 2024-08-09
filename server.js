import express from "express";
import bodyParser from "body-parser"
import uniqueId from "generate-unique-id";
import pg from "pg";



const app = express();
const port = 3000;




app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }))


const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "voting system",
    password: "Shubham@123",
    port: 5432,
})
db.connect();

let voterid;
async function register(FirstName, LastName, idNumber, instituteId, dob, gender, phone, address,votecount) {
    try {
        const voter_id = uniqueId({  
            length: 11,
            useLetters: false
        });
        await db.query("INSERT INTO register VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)", [FirstName, LastName, idNumber, instituteId, dob, gender, phone, address, voter_id,votecount]);

    }
    catch (err) {
        console.log(err);
    }


}

async function adminLogin(email,password) {
    try {
        const result = await db.query("SELECT * FROM adminLogin WHERE email = $1 AND password = $2", [email, password]);
        if (result.rows.length > 0) {
            return true;
        } else {
            return false;
        }
    }
    catch (err) {
        console.log(err);
    }
    
}
async function addCandidate(name,party,stdate,endate){

    try{
        await db.query("INSERT INTO addCandidate VALUES($1,$2,$3,$4)",[name,party,stdate,endate]);
        await db.query("INSERT INTO votecount value($1,$2)",[name,party]);
    }
    catch(err){
        console.log(err);
    }

}

//  async function votingSystem(voterId,phone) {
//     try {
//         const result = await db.query("SELECT phone_number,voter_id FROM register WHERE voter_id = $1 AND phone_number = $2", [voterId, phone]);
//        // console.log(result.rows);
//         if (result.rows[0].phone_number == phone && result.rows[0].voter_id == voterId) {
//             return true;
//         } else {
//             return false;
//     }
// }

//     catch (err) {
//         console.log(err);
//     }
// }


app.get("/", (req, res) => {
    res.render("index.ejs");
   
});
app.get("/register", (req, res) => {


    res.render("registration.ejs");
});


app.post("/voting-system", async(req, res) => {

    const phone=req.body.phone;
    
    const voterId=req.body.voterId;
    voterid=voterId;
   
    try {
        const result = await db.query("SELECT phone_number,voter_id FROM register WHERE voter_id = $1 AND phone_number = $2", [voterId, phone]);
       // console.log(result.rows);
        if (result.rows.length > 0) {
            const partyData=await db.query("SELECT candidate_name,party_name FROM addCandidate");
            res.render("voting-system.ejs",{votingData:partyData.rows});
        } else {
            res.redirect("/login");
            //res.render("alert.ejs");
    }
}

    catch (err) {
        res.send("not voted");
        console.log(err);
    }
})


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
    const vote=1;
    try{
        await register(FirstName, LastName, idNumber, instituteId, dob, gender, phone, address,vote);
    }
    catch(err){
        console.log(err);
    }
    
    res.redirect("/");
});
app.post('/adminLogin', async (req, res) => {

    const email = req.body.email;
    const password = req.body.password;
    const result = await adminLogin(email, password);
    if(result)
    {
        res.render("admin.ejs");
    }
    else
    {
       res.send("Error Login");
    }
})
app.get("/addCandidate", (req, res) => {

    res.render("admin.ejs");
});




app.post("/addCandidate", async(req, res) => {
    let name=req.body.name;
    let party=req.body.party;
    let stdate=req.body.startdate;
    let endate=req.body.enddate;
    await addCandidate(name,party,stdate,endate);
    res.redirect("/addCandidate");
   

});

app.post('/voteCount', async (req, res) => {

    const name = req.body.candidate;
    const isVoted=await db.query("SELECT votecount FROM register WHERE voter_id = $1", [voterid]);
    if(isVoted.rows[0].votecount!=0)
    {
        await db.query("update votecount set total_votes=total_votes+1 where candidate_name=$1",[name]);
        db.query("update register set votecount=0 where voter_id=$1",[voterid]);
        res.send("Voted Successfully!!!");
        res.redirect("/login");

    }
    else{
     res.send("Already Voted!!!");
    }
    

})


app.get("/login", (req, res) => {
    res.render("login.ejs");
})
app.get("/admin", (req, res) => {
    res.render("adminLogin.ejs");
});






app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
});