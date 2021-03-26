import dayjs from 'dayjs';

import github from '@lib/github';
import {getMarkdown} from '@lib/render';

export async function checkRepo(options){
    const since = await getSince({
        token: options.token,
        owner: options.dstOwner,
        repo: options.dstRepo,
        max_period: options.max_period || 1,
        workflow_id: options.workflow_id
    });

    const list = await getChangedFiles({
        token: options.token,
        owner: options.srcOwner,
        repo: options.srcRepo,
        dir: options.srcDir,
        since: since
    });

    if(!list.length) return console.log('No new commits.')

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
    console.log('Done!');
}

async function getSince(opts){
    let since = dayjs().subtract(opts.max_period,'days').toDate();

    if(opts.workflow_id){
        console.log('Check last run for workflow #'+opts.workflow_id);
        const GH = github(opts.token);
        const date = await GH.getActionLastRunDate(opts);
        console.log('Last run was at:', date || 'Never' );
        if(date) since = date;
    }

    return since;
}

async function getChangedFiles(opts){
    const GH = github(opts.token);
    const list = await GH.getChangedFiles(opts);
    return list;
}

async function postIssue(opts){
    const GH = github(opts.token);
    await GH.postIssue(opts);
}