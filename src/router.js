const express = require("express");
const router = new express.Router();
const NikeUser = require("./models/conn");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");

// middleware 

router.use(express.urlencoded({ extended: false }));
router.use(express.json());
router.use(cookieParser());

// route get 
router.get("/", (req, res) => {
    res.status(201).render("index");
})

router.get("/product", auth, (req, res) => {
    res.status(201).render("product");
})

router.get("/services", auth, (req, res) => {
    res.status(201).render("services");
})

router.get("/registration", (req, res) => {
    res.status(201).render("registration");
})

router.get("/login", (req, res) => {
    res.status(201).render("login");
})

router.get("/logout", auth , async (req, res) => {
    try
    {
        req.userMatch.tokens = req.userMatch.tokens.filter((val) => {
            return val.token !== req.token;
        })
        // req.userMatch.tokens = []; all drives cookie clear
        res.clearCookie("jwt");
        await req.userMatch.save();
        res.status(201).render("logout");
        
    } catch (error) {
        res.status(501).render("error5", { para: error });
        console.log(error)
    }
})

router.get("/404", (req, res) => {
    res.status(201).render("error4");
})

router.get("/501", (req, res) => {
    res.status(201).render("error5");
})

router.get("/register-api", auth, async (req, res) => {
    try
    {
        const apidata = await NikeUser.find({});
        res.status(201).send(apidata);
       
    } catch (error) {
        res.status(501).render("error5", { para: error });
    }
})



// router post 

router.post("/registration", async (req, res) => {
    try
    {
        const password = req.body.password;
        const confirmpassword = req.body.confirmpassword;
        
        if (password === confirmpassword)
        {
            const NikeUserData = new NikeUser({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                number: req.body.number,
                password: password,
                confirmpassword: confirmpassword
            });

            const token = await NikeUserData.tokenGenaret();
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 30000000),
                httpOnly : true
            });

            await NikeUserData.save();
            res.status(201).render("index");

        }
        else
        {
            res.status(404).render("error4", { para: "invalid password" });
        }
        
    } catch (error) {
        res.status(501).render("error5", { para: error });
    }
})


router.post("/login", async (req, res) => {
    try
    {
        const email = req.body.email;
        const password = req.body.password;

        const UserMail = await NikeUser.findOne({ email });
        const isMatch = await bcrypt.compare(password, UserMail.password);

        const token = await UserMail.tokenGenaret();
        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 30000000),
            httpOnly: true
            // secure : true  web secure korar jonno
        });

        isMatch ? res.status(201).render("index") : res.status(504).render("error4", { para: "invalid Password" });
        
       
    } catch (error) {
        res.status(501).render("error5", { para: error });
    }
})




// router export 

module.exports = router;