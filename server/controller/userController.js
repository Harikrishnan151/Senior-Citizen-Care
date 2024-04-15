
//1) import users model
const users=require('../model/userSchema')
const readytoBook = require('../model/readyToBook')
const bookings=require('../model/bookings')


//import bcryptjs for hide the password
const bcryptjs = require('bcryptjs');

//import jwt-token to authenticate user
const jwt=require('jsonwebtoken'); 
const Bookings = require('../model/bookings');


// Logic for user registeration
exports.registerUser=async(req,res)=>{
    console.log('Inside api call for user registeration');
    const {username,email,password,number,address} =req.body
    const hashedPassword=bcryptjs.hashSync(password, 10)
    try{
        const existingUser=await users.findOne({email:email});
        if(existingUser){
            res.status(406).json({message:'Account already exist'})
        }else{
            const newUser=new users({
                username,email,password:hashedPassword,number,address
            });
            await newUser.save()
            res.status(200).json({newUser,message:'Account Registered'})
        }
    }catch(err){
        console.log(err);
        res.status(500).json({message:'Internal server error'})
    }
}

// Logic for User-login
exports.loginUser=async(req,res)=>{
    console.log('Inside API call to login user');
    const{email,password}=req.body
    try{
        const existingUser=await users.findOne({email})
        if(!existingUser)
          return res.status(404).json({message:'User not found'})
        const validPassword=bcryptjs.compareSync(password,existingUser.password)
        if(!validPassword)
         return res.status(401).json({message:'Incorrect password'})
         const token=jwt.sign({
              userid:existingUser._id,
              userEmailId:existingUser.email,
              userName:existingUser.username
            },"superkey2024")
            res.cookie('access_token',token,{httpOnly :true}).status(200).json({existingUser,token})
    }catch(err){
        res.status(401).json({message:'Account does not exist'}) 
    }
}

//Logic for google sign-in (backend logic created but not tested . test after frontend integrated)
exports.googleLogin=async(req,res,next)=>{
    try{
        const user=await users.findOne({email: req.body.email})
        if(user){
            const token=jwt.sign({userid:user._id},"superkey2024")
            res.cookie('access_token',token,{httpOnly :true}).status(200).json({user,token})
        }else{
            const generatedPassword=Math.random().toString(36).slice(-8)+ Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser= new users({
                username:req.body.name.split(' ').join('').toLowerCase() +Math.random().toString(36).slice(-4), 
                email:req.body.email,
                 password:hashedPassword})// photo not added
                 await newUser.save();
                 const token=jwt.sign({userid:user._id},"superkey2024")
                 res.cookie('access_token',token,{httpOnly :true}).status(200).json({user,token})

        }

    }catch(error){
        next(error)
    }
}

//Logic to signout user
exports.singnOut=async(req,res)=>{
    try {
        res.clearCookie('access_token');
        res.status(200).json('User has been logged out!');
      } catch (error) {
        next(error);
      }
}

//Logic for delete user
exports.deleteUser=async(req,res)=>{
    const userId = req.params.id;
    try {
        // Find the user by ID
        const user = await users.findById(userId);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        await users.findByIdAndDelete(userId);
        res.status(200).json({ message: 'User deleted successfully' });
      } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
      } 
}

//Logic to edit user details
exports.editUser=async(req,res)=>{
    console.log('Inside api call for edit user details');
    
    try{
        // if (req.body.password) {
        //     req.body.password = bcryptjs.hashSync(req.body.password, 10);
        //   }

          const updatedUser = await users.findByIdAndUpdate(
            req.params.id,
            
            {
              $set: {
                username: req.body.username,
                email: req.body.email,
                // password: req.body.password,
                number: req.body.number,
                address: req.body.address
              },
            },
            { new: true }
          );
          res.status(200).json({updatedUser,message:'user details updated'});
    }catch(error){
        res.status(500).json({ message: 'Internal server error' });
    }
    
}

//Logic to get all users list
exports.allUsers=async(req,res)=>{
  console.log('inside api call to get all users');
  try {
    const allUsersList=await users.find()
    res.status(200).json({allUsersList,message:'All users list'})
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

//Logic to reset user password
exports.ResetUserPassword=async(req,res)=>{
    console.log('inside API call for reset password');
    try {
         if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
            const resetPass = await users.findByIdAndUpdate(
                req.params.id,
                
                {
                  $set: {

                    password: req.body.password,
                  },
                },
                { new: true }
              );
              res.status(200).json({resetPass,message:'Password updated successfully'});

          }
        
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });

    }
}
//Logic to search service provider
exports.searchServiceProvider = async (req, res) => {
  console.log('inside api call to search service provider');
  const { location, service } = req.body;
  try {
      const searchUser = await readytoBook.find({ location, service });
      if (searchUser.length === 0) {
          res.status(400).json({ message: 'No service provider available in this location' });
      } else {
          res.status(200).json({ searchUser, message: 'List of service providers in this location' });
      }
  } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
  }
};


//logic to book service provider primery
exports.PrimaryBooking=async(req,res)=>{
  console.log('inside service provider Primary booking function')
      const {typeOfCare,services,startingTime,endingTime,startDate,endDate,location,
        serviceProviderName,service,serviceProviderId,profile_img,serviceProviderEmail,
        serviceProviderMobile,rate}=req.body
         console.log(typeOfCare,services,startingTime,endingTime,startDate,endDate,location,
          serviceProviderName,service,serviceProviderId,profile_img,serviceProviderEmail,
          serviceProviderMobile,rate);
        try {
          const token = req.headers.authorization;
            console.log(token);
         if (!token) {
                  return res.status(401).json({ message: "Unauthorized: No token provided" });
           }
          jwt.verify(token, 'superkey2024', async (err, decoded) => {
            if (err) {
              return res.status(403).json({ message: 'Forbidden: Invalid token' });
            }
        
          const userEmail= decoded.userEmailId
           const userName=decoded.userName
           const userId =decoded.userid

        const PrimaryReg=await Bookings({userEmail,userName,userId,typeOfCare,services,
          startingTime,endingTime,startDate,endDate,location,serviceProviderName,
          service,serviceProviderId,profile_img,serviceProviderEmail, serviceProviderMobile,
          rate,serviceProviderStatus:'pending',adminStatus:'pending'})

         await PrimaryReg.save()
          res.status(200).json({PrimaryReg,message:'Waiting For Service Provider Confirmation'})
           
        } )

        } catch (error) {
          res.status(500).json({ message: 'Internal server error' });  
        }
}
