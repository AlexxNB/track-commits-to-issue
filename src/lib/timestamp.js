import fs from 'fs';
import dayjs from 'dayjs';

const FILE = '.last_check';

export default {
    save(){fs.writeFileSync(FILE,String(dayjs().unix()))},
    get(){return fs.existsSync(FILE) ? Number(fs.readFileSync(FILE,'utf-8')) : undefined},
}