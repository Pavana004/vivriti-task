const router = require("express").Router();
const userdata = require("./modal");




//post

router.post("/registration", async (req, res) => {

    try {
        const Exituser = await userdata.findOne({ mobilenumber: req.body.mobilenumber })
        if (Exituser) {
            return res.status(400).json("Mobilenumber already taken");
        }
        const data = new userdata({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            mobilenumber: req.body.mobilenumber,
            address: req.body.address,
            department: req.body.department,
        });
        const result = await data.save();
        res.status(200).json(result);



    } catch (error) {
        res.status(500).send({ message: "INPUT ERROR" });
    }


});


//patch


router.put("/update/:id", async (req, res) => {
    try {

        const finduser = await userdata.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(finduser);


    } catch (error) {

        res.status(500).send({ message: "INPUT ERROR" });

    }
})

//get


router.get("/list", async (req, res) => {
    try {

        const userlist = await userdata.find();
        res.status(200).json(userlist);



    } catch (error) {

        res.status(500).send({ message: "INPUT ERROR" });

    }

});



// delete 


router.delete("/delete/:id",async(req,res)=>{
    try {

       await userdata.findByIdAndDelete(req.params.id);
       res.status(200).json("User Deleted Successfully");

        
    } catch (error) {
        res.status(500).send({ message: "INPUT ERROR" });
    }
})



module.exports = router;


