//1) import admin model
const admins=require('../model/adminSchema')
const serviceProvider=require('../model/serviceproviderSchema')

const blogs=require('../model/blogSchema')
const webinar=require('../model/webinarSchema')
const serviceProviderLeaveReq=require('../model/leaveReqSchema')
const serviceProviderAttendence = require('../model/attendenceServiceProvider')

// nodemailer import
const nodemailer = require('nodemailer');

// mail send usimg  smtp(simple mail transfer protocol)
async function sendConfirmationEmail(serviceProviderEmail,subject,textMessage) {
    // Create a Nodemailer transporter using SMTP
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.gmail, // Admin's email
            pass: process.env.gmailpsw // Admin's password
        }
    });


    // Send mail with defined transport object
    const info = await transporter.sendMail({
        from: 'projectmern123@gmail.com', // Admin's email address
        to: [serviceProviderEmail], // Service provider's email address
        subject: subject,
        text: textMessage
    });

    console.log('Confirmation email sent: ', info.messageId);
}

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

//Logic to add Bolgs
// exports.addBlogs=async(req,res)=>{
//     console.log('inside Api call to add Blogs');
//     const BlogImg=req.file.filename
//     const {title,date,image,description}=req.body
//     console.log(image);
//     try {
//         console.log(title,date,image,description);
//         if (!title || !date || !description) {
//             return res.status(400).json({ message: 'Missing required fields' });
//         }else{
//             const newBlog=new blogs({
//                 title,date,image:BlogImg,description
//             });
//             await newBlog.save()
//             res.status(200).json({newBlog,message:'Blog added succesfully'})
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({message:'Internal server error'})
        
//     }
// }
exports.addBlogs = async (req, res) => {
    console.log("inside Api call to add Blogs");
  
    const blogImg = req.file.filename;
    const { title, date, description } = req.body;
  
    try {
      console.log(title, date, blogImg, description); // Changed 'image' to 'blogImg'
  
      if (!title || !date || !description) {
        return res.status(400).json({ message: "Missing required fields" });
      } else {
        const newBlog = new blogs({
          title,
          date,
          image: blogImg,
          description, // Changed 'image' to 'blogImg'
        });
  
        await newBlog.save();
  
        res.status(200).json({ newBlog, message: "Blog added successfully" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

//Logic to get all added blogs
exports.getAllBlogs=async(req,res)=>{
    console.log('inside api call to get all blogs')
    try {
        const allBlogs=await blogs.find()
        res.status(200).json({allBlogs, message: 'list of all blogs' })
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Internal server error'})
        
    }
}

//Logic to get bolgs individully
exports.viewBlog=async(req,res)=>{
    console.log('indie Api call to view blog')
    const { id } = req.params;
    console.log(id);
    try{
        const blog=await blogs.findOne({_id: id })
        if(blog){
        res.status(200).json({blog,message:"blog fetched"})
        }else{
            res.status(401).json("blog not found")
        }
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:'Internal server error'})

    }

}

//Logic to delete bolg
exports.deleteBlog=async(req,res)=>{
    console.log('inside api call to delete blog');
    const {id}=req.body
    try {
        const deleteReq=await blogs.deleteOne({_id:id})
        if(!deleteReq){
            res.status(404).json({message:'blog not found'})
        }
        res.status(200).json({message:'Blog deleted'})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Internal server error'})
        
    }
}

//Logic to add webinar
exports.addWebinar=async(req,res)=>{
    console.log('inside api call to add webinar')
    const webinarImg=req.file.filename
    const {title,topics,date,time,image,description,speaker}=req.body
    try { 
        if(!title || !topics || !date || !time || !description || !speaker){
            return res.status(400).json({ message: 'Missing required fields' }); 
        }else{
            const newWebinar=new webinar({
                title,topics,date,time,image:webinarImg,description,speaker
            });
            await newWebinar.save()
            res.status(200).json({newWebinar,message:'Webinar added succesfully'})
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Internal server error'})    
    }


}

//Logic to get all webinar
exports.getAllWebinar=async(req,res)=>{
    console.log('inside api call to get all blogs')
    try {
        const allWebinar=await webinar.find()
        res.status(200).json({allWebinar, message: 'list of all webinars' })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Internal server error'})       
    }
}

//Logc to view single webinar
exports.viewWebinar=async(req,res)=>{
    console.log('inside api call to view single webinar')
    const { id } = req.params;
    console.log(id);
    try {
        const webinarView=await webinar.findOne({_id: id })
        if(webinarView){
        res.status(200).json({webinarView,message:"webiner fetched"})
        }else{
            res.status(401).json("webinar not found")
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Internal server error'})    
    }

}

//Logic to delete webinar
exports.deleteWebinar=async(req,res)=>{
    console.log('inside api call to delete webinar')
    const {id}=req.body
    try {
        const deleteReq=await webinar.deleteOne({_id:id})
        if(!deleteReq){
            res.status(404).json({message:'webinar not found'})
        }
        res.status(200).json({message:'webinar deleted'})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Internal server error'})
        
    }

}

//Logic to get all leave request
exports.getAllLeaveReq=async(req,res)=>{
    console.log('inside api call to get all leave req')
    try {
        const allReq=await serviceProviderLeaveReq.find()
        res.status(200).json({allReq,message:'List of all leave req'})
        
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
}

//Logic to reject leave request
exports.rejectLeaveReq=async(req,res)=>{
    console.log('inside api call to reject leave req')
    const{id}=req.body
    try {
        const rejectReq = await serviceProviderLeaveReq.findByIdAndUpdate(
            id,
            
            {
              $set: {
                status:'Rejected'
              },
            },
            { new: true }
          );
          const mail=rejectReq.email
          console.log(mail);
          textMessage='Your Leave Application Rejected...! Please Contact Your Admin Personally For Any Queries...'
          subject='Rejected Leave Request....!'
           sendConfirmationEmail(mail,subject,textMessage) 

          res.status(200).json({rejectReq,message:'Leave Request rejected'});
        
    } catch (error) {
        res.status(500).json({message:"Internal server error"}) 
    }
}

//Logic to get all leave request
exports.getAllLeaveReq=async(req,res)=>{
    console.log('inside api call to get all leave req')
    try {
        const allReq=await serviceProviderLeaveReq.find()
        res.status(200).json({allReq,message:'List of all leave req'})
        
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
}

//Logic to accept leave request
exports.acceptLeaveReq=async(req,res)=>{
    console.log('inside api call to accept leave request')
    const{id}=req.body
    try {
        const user=await serviceProviderLeaveReq.findById(id)
        const userId=user.serviceProviderId
        const Date=user.date
        console.log(userId,Date)

        const checkServiceProvider=await serviceProviderAttendence.findOne({serviceProvidersId:userId,date:Date})
        console.log(checkServiceProvider);
        if(checkServiceProvider){
            res.status(404).json({message:'Connot Approve Leave Request Due to service Provider already marked attandence on same date'})
        }else{
            console.log("insideattendance");

            const acceptReq = await serviceProviderLeaveReq.findByIdAndUpdate(
                id,
                
                {
                  $set: {
                    status:'Accepted'
                  },
                },
                { new: true }
              );
              const mail=acceptReq.email
              console.log(mail);
              textMessage='Your Leave Application is Accepted'
              subject='Leave Request Accepted'
               sendConfirmationEmail(mail,subject,textMessage) 
    
    
              res.status(200).json({acceptReq,message:'Leave Request Accepted'});
            
        }

        } catch (error) {
            res.status(500).json({message:"Internal server error"}) 
        }


}