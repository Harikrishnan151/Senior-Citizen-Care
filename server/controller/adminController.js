//1) import admin model
const admins=require('../model/adminSchema')
const serviceProvider=require('../model/serviceproviderSchema')

// Logic for User-login
exports.adminLogin=async(req,res)=>{
    console.log("inside api call admin login");
    const {username,password}=req.body
    try {
        const existingAdmin=await admins.findOne({username,password})
        if(existingAdmin !==null && existingAdmin !== undefined){
            res.status(200).json({existingAdmin,message:'Login in sucessfull'})
        }else{
            res.status(404).json({message:'incorrect email or password'})
        }
    } catch (error) {
        res.status(401).json({message:'Account does not exist'})
    }
}

// Logic to get all serverviceProviders request to approve
exports.getAllserviceproviders=async(req,res)=>{
    console.log('inside API call to get all service providers');
    try{
        const allServiceproviders=await serviceProvider.find()
        res.status(200).json({allServiceproviders,message:'list of all service providers'})
    
    }catch(error){
        res.status(500).json({message:'internal server error'})
    }

}