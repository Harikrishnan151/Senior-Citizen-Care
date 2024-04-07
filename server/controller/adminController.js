//1) import admin model
const admins=require('../model/adminSchema')
const serviceProvider=require('../model/serviceproviderSchema')

const blogs=require('../model/blogSchema')

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
exports.addBlogs=async(req,res)=>{
    console.log('inside Api call to add Blogs');
    const BlogImg=req.file.filename
    const {title,date,image,description}=req.body
    console.log(image);
    try {
        console.log(title,date,image,description);
        if (!title || !date || !description) {
            return res.status(400).json({ message: 'Missing required fields' });
        }else{
            const newBlog=new blogs({
                title,date,image:BlogImg,description
            });
            await newBlog.save()
            res.status(200).json({newBlog,message:'Blog added succesfully'})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Internal server error'})
        
    }
}

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