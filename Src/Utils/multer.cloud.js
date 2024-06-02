import multer from "multer";

export const fileValidation = {
    image : ['image/png' , 'image/jpeg' , 'image/gif'],
    file : ['application/pdf' , 'application/msword']
}

export function fileUpload(customValidation=[]){
    const storage = multer.diskStorage({})
    const fileFilter = (req,file,cb)=>{
        if(customValidation.includes(file.mimetype)){
            cb(null,true)
        }else{
            cb(new Error("IN-VALID FILE FORMAT" , {cause:400}) , false)
        }
    }
    const upload = multer({
        fileFilter,
        storage,
        limits : {
            fileSize : 1024 * 1024 * 10
        }
    })
    return upload
}