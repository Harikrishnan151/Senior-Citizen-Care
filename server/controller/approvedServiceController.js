//1) import admin model
const approvedServiceProvider = require('../model/approvedServiceprovider')
const serverviceProviders = require('../model/serviceproviderSchema')
const serviceProviderAttendence = require('../model/attendenceServiceProvider')



//import jwt-token to authenticate user
const jwt = require('jsonwebtoken')

// nodemailer import
const nodemailer = require('nodemailer');
const serviceProvider = require('../model/serviceproviderSchema');


//Logic to approve serviceProvider
exports.approveServiceProvider = async (req, res) => {
    console.log('inside Api call to approve service provider');
    const { username, email, password, mobile, profile_img, service, specialization, qualification, experience_crt, exp_year, rate } = req.body
    try {
        const serviceProvider = await approvedServiceProvider.findOne({ email: email })
        if (serviceProvider) {
            res.status(401).json({ message: 'service provider already approved' })
        } else {
            const newServiceProvider = new approvedServiceProvider({
                username, email, password, mobile, profile_img, service, specialization, qualification, experience_crt, exp_year, rate
            })
            await newServiceProvider.save()

            const response = await serverviceProviders.findOne({ email: email })
            if (response) {
                const result = await serverviceProviders.deleteOne({ email })
                textmessage = 'Your request as a service provider has been approved. You can now login to the platform and start offering your services.'
                subjectmail = 'Service Provider Approval Confirmation'
                await sendConfirmationEmail(email, subjectmail, textmessage);
                res.status(200).json({ newServiceProvider, message: "Service Provider approved" })
            } else {
                res.status(404).json({ message: 'Approval Faild' })
            }
        }

    } catch (error) {
        res.status(500).json({ message: 'internal server error' })
    }
}

//Logic to reject service providers approval request
// exports.rejectServiceProviderReq=async(req,res)=>{
//     const{email}=req.body
//     try {
//         const deleteReq=await serverviceProviders.deleteOne({email})
//         textmessage = 'Your request as a service provider has been rejected by the admin.'
//         subjectmail = 'Rejection Mail...!!!'
//         await sendConfirmationEmail(email, subjectmail, textmessage);
//         res.status(200).json({deleteReq,message:'Service provider request deleted'})
//     } catch (error) {
//         res.status(500).json({ message: 'internal server error' })
//     }

// }

exports.rejectServiceProviderReq = async (req, res) => {
    console.log('inside Api call to reject user approval..!!!')
    const { email } = req.body;
    try {
        const deleteReq = await serverviceProviders.deleteOne({ email });
        if (!deleteReq) {
            return res.status(404).json({ message: 'Service provider not found' });
        }
        textmessage = 'Your request as a service provider has been rejected by the admin.'
        subjectmail = 'Rejection Mail...!!!'
        await sendConfirmationEmail(email, subjectmail, textmessage);
        res.status(200).json({ deleteReq, message: 'Service provider request deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


//Logic for approved service provider login
exports.serviceProviderLogin = async (req, res) => {
    console.log('inside api call to login service provider');
    const { email, password } = req.body
    console.log(email);
    console.log(password);
    try {
        const existingUser = await approvedServiceProvider.findOne({ email, password })
        if (existingUser !== null && existingUser !== undefined) {
            const token = jwt.sign({
                serviceProviderid: existingUser._id
            }, 'superkey2024')
            res.status(200).json({ existingUser, token, message: 'Login Sucessfull' })
        } else {
            res.status(404).json({ message: 'Incorrect email or password' })
        }
    } catch (error) {
        res.status(500).json({ message: 'Request not approved by the Admin' })
    }
}

// mail send usimg  smtp(simple mail transfer protocol)
async function sendConfirmationEmail(serviceProviderEmail) {
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
        subject: subjectmail,
        text: textmessage
    });

    console.log('Confirmation email sent: ', info.messageId);
}

//Logic to get all approved service providers
exports.allServiceProviders = async (req, res) => {
    console.log('inside api call to get all approved service providers');
    try {
        const allApprovedServiceproviders = await approvedServiceProvider.find()
        res.status(200).json({ allApprovedServiceproviders, message: 'list of all service providers' })

    } catch (error) {
        res.status(500).json({ message: 'internal server error' })
    }

}

//Logic to mark service provider attendence
exports.serviceProviderAttendance = async (req, res) => {
    console.log('Inside API call to mark attendance');
    const { date, time_in, time_out, working_hours, present } = req.body;

    try {
        console.log(date, time_in, time_out, working_hours, present);
        if (!date || !time_in || !time_out || !working_hours || !present) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const token = req.headers.authorization
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }
        jwt.verify(token, 'superkey2024', async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Forbidden invalid token' })
            }
            req.userId = decoded.serviceProviderid
            const userId = req.userId;
            console.log(userId);
            // Check if the service provider exists
            const user = await approvedServiceProvider.findOne({ _id: userId });
            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            // Check if attendance for the service provider on the given date is already marked
            const check = await serviceProviderAttendence.findOne({ serviceProvidersId: userId, time_in, time_out, working_hours, present: true });
            if (check) {
                return res.status(400).json({ message: 'Attendance already marked' });
            }

            // Create new attendance record
            const newAttendance = new serviceProviderAttendence({
                date, time_in, time_out, working_hours, serviceProvidersId: userId, present
            });
            await newAttendance.save();

            res.status(200).json({ message: 'Attendance marked successfully', newAttendance });
        })

    } catch (error) {
        console.error('Error marking attendance:', error);
        res.status(500).json({ error, message: 'Internal server error' });
    }
};


