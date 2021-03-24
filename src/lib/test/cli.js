export function cli(){
    const commands = {};
    return {
        command(name,fn){
            commands[name]=fn;
            return this;
        },
        run(){
            const CMD = process.argv[2] ? process.argv[2].replace('--','') : 'main';
            const DATA = process.argv[3];
            if(!commands[CMD]) throw new Error('Unknown command');
            commands[CMD](DATA);
        },
        error(msg){
            console.error(`\u001b[31m${msg}\u001b[39m\n\n`);
            process.exit(1);
        }
    }
}