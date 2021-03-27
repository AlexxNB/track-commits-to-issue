import dayjs from 'dayjs';

import github from '@lib/github';
import {getMarkdown} from '@lib/render';

export async function checkRepo(options){
    const since = await getSince({
        token: options.token,
        owner: options.dstOwner,
        repo: options.dstRepo,
        max_period: options.max_period || 24,
        run_id: options.run_id
    });

    const list = await getChangedFiles({
        token: options.token,
        owner: options.srcOwner,
        repo: options.srcRepo,
        dir: options.srcDir,
        since: since
    });

    if(!list.length) return;

    const body = getMarkdown({
        owner: options.srcOwner,
        repo: options.srcRepo,
        commits: list.reverse()
    });

    if(options.return) return body;

    postIssue({
        token: options.token,
        title: `[${dayjs().format('YYYY-MM-DD')}] ${options.issue_title || `New commits in ${options.srcOwner}/${options.srcRepo}`}`,
        owner: options.dstOwner,
        repo: options.dstRepo,
        body: body
    })
}

async function getSince(opts){
    let since = dayjs().subtract(opts.max_period,'hours').toDate();

    if(opts.run_id){
        const GH = github(opts.token);
        console.log('Check last run for curent workflow...');
        const date = await GH.getActionLastRunDate(opts);
        console.log('Last run was at:', date || 'Never' );
        if(date) since = date;
    }

    return since;
}

async function getChangedFiles(opts){
    const GH = github(opts.token);
    console.log('Fetch changed files since',opts.since,'...');
    const list = await GH.getChangedFiles(opts);
    console.log('Found',list.length,'commits!');
    return list;
}

async function postIssue(opts){
    console.log(`Posting an issue at ${opts.owner}/${opts.repo}...`)
    const GH = github(opts.token);
    await GH.postIssue(opts);
    console.log('Issue created!');
}