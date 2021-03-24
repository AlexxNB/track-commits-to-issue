import {cli} from '@testlib/cli';
import {saveToken,deleteToken,getToken} from '@testlib/token';
import {checkRepo} from '@tracker';

const params = {
    token: getToken(),
    srcOwner: 'sveltejs',
    srcRepo: 'kit',
    srcDir: 'documentation',
    dstOwner: 'AlexxNB',
    dstRepo: 'track-commits-to-issue'
}

const prog = cli();

prog.command('main', async () => {
    await checkRepo(params);
});

prog.command('save-token', token => {
    if(!token) prog.error('You mast provide a token value: npm run token:save <token>');
    saveToken(token);
});

prog.command('clear-token', deleteToken);

prog.run();