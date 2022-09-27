const express = require("express");
const path = require("path")
const app = express();
const hbs = require("hbs");

require("./db/conn");
const Register = require("./models/registers");
const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const pertials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(pertials_path);

app.get("/", (req, res) => {
    res.render("index")
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/login", (req, res) => {
    res.render("login");
});

// Create a new User in the database
app.post("/register", async(req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if(password === cpassword){
            const registermember = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: password,
                confirmpassword: cpassword
            })

            const registered = registermember.save();
            res.status(201).render("index");

        }else{
            res.send("passwords are not matching")
        }
    } catch (error) {
        res.status(400).send(error);
    }
});

app.post("/login", async(req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Register.findOne({email:email});
        
        
        if(useremail.password === password){
            res.status(201).render("index");
        }else{
            res.send("Invalid login Details");
        }
        
    } catch (error) {
        res.status(400).send("Invalid login Details")
    }

})

app.listen(port, () => {
    console.log(`server is running at port no. ${port}`);
})