import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({path : path.join(__dirname , '../../Config/.env')})

import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME , 
  api_key: process.env.API_KEY , 
  api_secret: process.env.API_SECRET ,
  secure:true
});

export default cloudinary