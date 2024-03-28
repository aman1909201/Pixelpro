"use server"

import { revalidatePath } from "next/cache"
import { connectToDatabase } from "../databases/mongooses"
import { handleError } from "../utils"
import User from "../databases/models/user.model"
import Image from "../databases/models/image.model"
import { redirect } from "next/navigation"
import {v2 as cloudinary} from "cloudinary"

const populateUser=(query: any)=> query.populate({
    path: 'author',
    model: User,
    select: '_id firstName lastName clerkId'
})
//ADDIMAGE
export async function addImage({image, userId, path}: AddImageParams){
    try {
        await connectToDatabase()
        const author= await User.findById(userId)

        if(!author){
            throw new Error("User not found")
        }

        const newImage= await Image.create({
            ...image,
            author: author._id,
            
        })

        revalidatePath(path)
        return JSON.parse(JSON.stringify(newImage))
    } catch (error) {
        handleError(error)
    }
}

//UPDATE IMAGE
export async function updateImage({image, userId, path}: UpdateImageParams){
    try {
        await connectToDatabase()

        const imagetoupdate= await Image.findById(image._id)
        if(!imagetoupdate || imagetoupdate.author.toHexString() !== userId){ // whether user has permission to update
            throw new Error("Image not found or unauthorized")
        }

        const updateimage= await Image.findByIdAndUpdate(
            imagetoupdate._id,
            image,
            {new: true} // new instance of the document
        )
        revalidatePath(path)
        return JSON.parse(JSON.stringify(updateimage))
    } catch (error) {
        handleError(error)
    }
}


export async function deleteImage(imageId:string){
    try {
        await connectToDatabase()
        await Image.findByIdAndDelete(imageId)
       
    } catch (error) {
        handleError(error)
    }
    finally{
        redirect("/")
    }
}

export async function getImageById(imageId:string){
    try {
        await connectToDatabase()
        const image= await populateUser(Image.findById(imageId)) // we data of author who created the image
        if(!image) throw new Error("image not found")
       
        return JSON.parse(JSON.stringify(image))
    } catch (error) {
        handleError(error)
    }
   
}

export async function getAllImages({limit=9, page=1, searchQuery= ""}:{
    limit?:number,
    page: number,
    searchQuery?:string
}){
    try {
        await connectToDatabase()
       
        cloudinary.config({
            cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true
        })

        let expression= 'folder=PixelPro'
        if(searchQuery){
            expression +=`AND ${searchQuery}`
        }

        const {resources}= await cloudinary.search
        .expression(expression)
        .execute()

        const resourceID= resources.map((resource:any)=>resource.public_id) // getting from database

        let query={} //quering for own database
        if(searchQuery){
            query={
                publicId:{
                    $in: resourceID
                }
            }
        }

        const skipamount=(Number(page)-1)*limit

        const images= await populateUser(Image.find(query))
        .sort({updateat:-1}) // newerone appear on top
        .skip(skipamount)
        .limit(limit)

        const totalImages= await Image.find(query).countDocuments() 
        const savedImages= await Image.find().countDocuments()
        
        return{
            data: JSON.parse(JSON.stringify(images)),
            totalpage: Math.ceil(totalImages/limit),
            savedImages
        }
    } catch (error) {
        handleError(error)
    }
   
}
export async function getUserImages({
    limit = 9,
    page = 1,
    userId,
  }: {
    limit?: number;
    page: number;
    userId: string;
  }) {
    try {
      await connectToDatabase();
  
      const skipAmount = (Number(page) - 1) * limit;
  
      const images = await populateUser(Image.find({ author: userId }))
        .sort({ updatedAt: -1 })
        .skip(skipAmount)
        .limit(limit);
  
      const totalImages = await Image.find({ author: userId }).countDocuments();
  
      return {
        data: JSON.parse(JSON.stringify(images)),
        totalPages: Math.ceil(totalImages / limit),
      };
    } catch (error) {
      handleError(error);
    }
  }