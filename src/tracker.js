import timestamp from '@lib/timestamp';
import dayjs from 'dayjs';

import github from '@lib/github';
import {getMarkdown} from '@lib/render';

export async function checkRepo(options){
    const list = await getChangedFiles({
        token: options.token,
        owner: options.srcOwner,
        repo: options.srcRepo,
        dir: options.srcDir
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
    const lastCheck = timestamp.get();
    opts = {
        max_period: 5,
        ...opts
    };
    opts.since = (lastCheck && dayjs.unix(lastCheck).toDate()) || dayjs().subtract(max_period,'days').toDate();

    const list = await GH.getChangedFiles(opts);
    timestamp.save();

    return list;
}

async function postIssue(opts){
    const GH = github(opts.token);
    await GH.postIssue(opts);
}