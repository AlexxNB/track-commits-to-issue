import fs from 'fs';
import dayjs from 'dayjs';

const FILE = '.last_check';

export default {
    save(){fs.writeFileSync(FILE,String(dayjs().unix()))},
    get(){
        const time = fs.existsSync(FILE) && Number(fs.readFileSync(FILE,'utf-8'));
        console.log(time ? 'Found last timestamp: '+dayjs.unix(time).format('YYYY-MM-DD') : 'No last timestamp');
        return time || undefined;
    },
}