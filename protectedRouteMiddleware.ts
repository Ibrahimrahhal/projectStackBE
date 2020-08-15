import Config from './config';
import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import { NextFunction, Response, Request } from 'express';


const jwks = {"keys":[{"alg":"RS256","e":"AQAB","kid":"Yc+cnkuhSZlv078sIl8IpxQZNTxt14Rq2hWRBlbZ71k=","kty":"RSA","n":"yzpb3ATDcIL7T4b4t2Y2HnqiUslEP7BQYLwucyPlG8jxNmuKNQWl1_zNO67DwsKf-lXvUJe94f_kRCTE-qiCPiVmqzfONUf-wIoHaLTIY2eWGIVmosTsIkYYhtye_q-lA1aZGobFSbaPDnGfxADh_kZbEqlASMUDUWVzMqKFvgoJf1MgaXdv7tXKbzWn09dEYzSODBeML5FRXr9BH0AZRxL74w7IJK52DMNFTIoM7cT4KyvgoPoOr3TW_tnwSbvhRMUAGnYclCxT1_EpiD0hnlMe9qRrA1yEqTdvZUTkfK_8yH0JGSwd7HSpbSE7yixhByar9yBDjgQ2UBh-BtdlTw","use":"sig"},{"alg":"RS256","e":"AQAB","kid":"Dc2JRz2eHC76vtAaQAtZW1M2lfnna0H/0tdZUDpe1+g=","kty":"RSA","n":"wMzESTb99CCh6ygbOQ-eH2rQMKX2cHab3DgOWIyAmr-8Hpkq6dEc1rP-Zxf3iZupdumniIQOYTDROplQijij281xa8_EvbjrJDOXQ5fM6ZT0c3mzsxBRyPu8q-GSvAprJpyZ12NRcmeKjIlTMeq9nGlpU5tOqqoHF2IrMe95rjt-ARmx_1kCAt9hRvpMwmoMLYWTUQ34VJmpXNsAXPcATxHBuTprNR_uTTG8QYNy2MJ9bNPROS66KiwRCNB0GxgiHU7qJbv48NJ15BGa53wSFjWp2k0lAbGfDqXVplpfMCpvIifK1_8qyEPmfoKwiITUYYtLRukUptVXh5CiBp_9Qw","use":"sig"}]}

export default function(req:Request, res:Response, next:NextFunction){
    if(req.method == "OPTIONS"){
        res.sendStatus(200)
        return;
    }

    let token = req.headers['authorization'];
    let decoded = jwt.decode(token, {complete: true});

    if((!token || !decoded) && !Config.disableAuth){
        res.sendStatus(401);
        return;
    }else if(token && decoded){
        let kid = (decoded as any).header.kid;
        let jwk:any = jwks.keys.find((one)=>{
            return one.kid == kid;
        })
        let pem = jwkToPem(jwk);
        jwt.verify(token, pem, { algorithms: ['RS256'] }, function(err, decodedToken) {
            if(err){
                res.sendStatus(401);
                return;
            }else{
                (req as any).user = decodedToken;
                next()
            }
        });
    }else{
        next();
    }

}


export function validateUpdateReqBelongToSameUser(req:Request, res:Response, emailInID:string){
    if((req as any).user.email == emailInID)
        return true;
    res.sendStatus(401);
    return false;
}