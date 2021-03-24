import dayjs from 'dayjs';

import github from '@lib/github';
import {getMarkdown} from '@lib/render';

export async function checkRepo(options){
    const list = await getChangedFiles({
        token: options.token,
        owner: options.srcOwner,
        repo: options.srcRepo,
        dir: options.srcDir,
        max_period: options.max_period
    });

    if(!list.length) return console.log('No new commits.')

    const body = getMarkdown({
        owner: options.srcOwner,
        repo: options.srcRepo,
        commits: list.reverse()
    });

    postIssue({
        token: options.token,
        title: `[${dayjs().format('YYYY-MM-DD')}] ${options.issue_title || `New commits in ${options.srcOwner}/${options.srcRepo}`}`,
        owner: options.dstOwner,
        repo: options.dstRepo,
        body: body
    })
    console.log('Done!');
}

async function getChangedFiles(opts){
    const GH = github(opts.token);
    opts = {
        max_period: 1,
        ...opts
    };
    opts.since = dayjs().subtract(opts.max_period,'days').toDate();

    const list = await GH.getChangedFiles(opts);

    return list;
}

async function postIssue(opts){
    const GH = github(opts.token);
    await GH.postIssue(opts);
}