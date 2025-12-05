const User = require("../models/User");
const userIncome = require("../models/userIncome")

 exports.addIncome = async (req, res) => {

    const userId = req.user.id;

    try {
        const {icon ,source , amount, date} = req.body;

        //validation: check missing field

        if(!source || !amount || !date){
            return res.status(400).json({message:"All fields are required"})
        }
        const newIncome = new userIncome({
            userId,
            icon,
            source,
            amount,
            date:new Date(date)
        });
        await newIncome.save();
        res.status(200).json(newIncome);
    } catch (error) {
        res.status(500).json({message: "server error"})
    }
 }
  exports.getAllIncome = async (req, res) => {
    const userId = req.user.id;

    try{
        const income = await userIncome.find({userId}).sort({date: -1});
        res.json(income);
    } catch(error){
        res.status(500).json({message:"server Error",error: error.message})
    }
 }
  exports.deleteIncome = async (req, res) => {
    try{
        await userIncome.findByIdAndDelete(req.params.id)
        res.json({message: "Income Deleted Sussefullty"})
    }catch(error){
        res.status(500).json({message:"server error"})
    }
 }