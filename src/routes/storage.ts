
import express from 'express';
import Config from '../config';
import { 
    encryptData, 
    decryptData, 
    getValueFromKeyInEncryptedObject, 
    hashFunction,
    promiseBasedPutObject, 
    prmosieBasedUpdateItem } from '../util';

const router = express.Router();

router.put('/profile', async (req, res)=>{
    const { body } = req;
    let type =  getValueFromKeyInEncryptedObject('imgType', body);
    let base64 = body.data.split(';base64,')[1];
    let ContentType = body.data.split(';base64,')[0].split(":")[1];
    await promiseBasedPutObject({
        Body: Buffer.from(base64,'base64'),
        ContentEncoding: 'base64',
        ContentType,
        Key:`${hashFunction((req as any).user.email)}.${type}`,
        Bucket: Config.buckets.userProfile
    });
    res.json({
        data: encryptData(`${Config.getBucketBaseUrl(Config.buckets.userProfile)}${hashFunction((req as any).user.email)}.${type}`)
    });
});

router.put('/resume', async(req, res)=>{
    const { body } = req;
    let type =  getValueFromKeyInEncryptedObject('resumeType', body);

    await promiseBasedPutObject({
        Body:  Buffer.from(body.data,'base64'),
        Key:`${hashFunction((req as any).user.email)}.${type}`,
        Bucket: Config.buckets.userResumes
    });
    res.json({
        data: encryptData(`${hashFunction((req as any).user.email)}.${type}`)
    });
});



export default router;