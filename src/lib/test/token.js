import fs from 'fs';

const TOKENFILE = '.github_token'

export function saveToken(token){
    fs.writeFileSync(TOKENFILE,token);
}

export function getToken(){
    if(!fs.existsSync(TOKENFILE)) return undefined;
    return fs.readFileSync(TOKENFILE,'utf-8');
}

export function deleteToken(){
    if(fs.existsSync(TOKENFILE)) fs.unlinkSync(TOKENFILE);
}