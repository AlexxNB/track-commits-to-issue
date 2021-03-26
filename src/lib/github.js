import github from '@actions/github';
import sha256 from 'sha256';
import dayjs from 'dayjs';

export default function(token){
    const octokit = github.getOctokit(token)
    return {
        getChangedFiles: (opts)=>getChangedFiles(octokit,opts),
        postIssue: (opts)=>postIssue(octokit,opts),
        getActionLastRunDate: (opts)=>getActionLastRunDate(octokit,opts)
    }
}

async function getChangedFiles(octokit,opts){
    let page = 1;
    let per_page = 20;
    let result = [];

    const repo = {
        owner: opts.owner,
        repo: opts.repo
    }
    
    let length;
    do{

        let list = await octokit.rest.repos.listCommits({
            ...repo,
            path:opts.dir,
            per_page,
            page: page++,
            since: opts.since 
        });

        length = list.data.length;

        for(let {sha} of list.data){
            const {data} = await octokit.rest.repos.getCommit({
                ...repo,
                ref: sha,
            });
            result.push({
                message:  data.commit.message.split('\n')[0],
                url:  data.html_url,
                date: dayjs(data.commit.author.date).unix(),
                author:  {
                    name: data.commit.author.name,
                    url: data.author.html_url,
                },
                files: data.files.filter(f=>f.filename.startsWith(opts.dir)).map(f => {
                    return{
                        filename: f.filename,
                        diff_url: `${data.html_url}#diff-${sha256(f.filename)}`
                    }
                })
            })
        }
    
    }while(length == per_page);

    return result;
}

async function postIssue(octokit,opts){
    const repo = {
        owner: opts.owner,
        repo: opts.repo
    }
    await octokit.rest.issues.create({
        ...repo,
        title: opts.title,
        body: opts.body
    });
}

async function getActionLastRunDate(octokit,opts){
    const repo = {
        owner: opts.owner,
        repo: opts.repo
    }
    const runs = await octokit.rest.actions.listWorkflowRuns({
        ...repo,
        workflow_id: opts.workflow_id,
        per_page: 2
    });
    return runs.data.total_count > 1 && runs.data.workflow_runs[1].updated_at;
}