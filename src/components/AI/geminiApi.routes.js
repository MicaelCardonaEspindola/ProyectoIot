import {Router} from "express"
import { generateEnergyDashboard, getModelGemini, postImgToHtml, rawDataToText} from "./geminiApi.controllers.js";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
const geminiApiRouter = Router() ;

geminiApiRouter.get('/:apiKey', getModelGemini)
geminiApiRouter.post('/image-to-html/:apiKey', upload.single('image'),postImgToHtml)
geminiApiRouter.post('/CreateDashBoard/:apiKey',generateEnergyDashboard)
geminiApiRouter.post('/rawDataToText/:apiKey',rawDataToText)

export default geminiApiRouter; 