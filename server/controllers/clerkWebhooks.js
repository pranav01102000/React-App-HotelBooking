import User from "../models/User.js";
import {Webhook} from "svix";

const clerkWebhooks = async(req,res)=>{
    try{
        //svix instance with clerk webhook secret.
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
        //Getting Headers
        const headers={
            "svix-id":req.headers["svix-id"],
            "svix-timestamp":req.headers["svix-timestamp"],
            "svix-signature":req.headers["svix-signature"],

        };
        //Verifying Headers
        // CORRECTED: Changed 'json.stringify' to 'JSON.stringify'
        await whook.verify(JSON.stringify(req.body),headers)
        //Getting Data from request body
        const{data, type}= req.body

        const userData ={
                _id: data.id, // Ensure your User model's _id field is of type String
                email: data.email_addresses[0].email_address,
                // CORRECTED: Added a space between first_name and last_name for username
                username: data.first_name + " " + data.last_name,
                image: data.image_url,
            }
          //Switch Cases for different Events
          switch (type){
            case "user.created":{
                 await User.create(userData);
                 break;
                }
            case "user.updated":{
                 // CORRECTED: Added { new: true, upsert: true } for proper update/creation behavior
                 await User.findByIdAndUpdate(data.id , userData, { new: true, upsert: true });
                 break;
                }
            case "user.deleted":{
                 await User.findByIdAndDelete( data.id);
                 break;
                }

            default:
                 break;
          }
          res.json({success:true, message:"Webhook Recieved"})
    }catch(error){
        // CORRECTED: Changed status to 500 for server errors
        console.error("Webhook processing error:", error.message); // Use console.error for errors
        res.status(500).json( {success:false, message:error.message});

    }
}

export default clerkWebhooks;