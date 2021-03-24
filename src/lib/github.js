import GitHub from 'github-api';
import sha256 from 'sha256';
import dayjs from 'dayjs';

export default function(token){
    const gh = new GitHub({token});
    return {
        getChangedFiles: (opts)=>getChangedFiles(gh,opts),
        postIssue: (opts)=>postIssue(gh,opts)
    }
}

async function getChangedFiles(gh,opts){
    let page = 1;
    let per_page = 20;
    let result = [];

    const repo = gh.getRepo(opts.owner,opts.repo);
    
    let length;
    do{

        let list = await repo.listCommits({
            path:opts.dir,
            per_page,
            page: page++,
            since: opts.since 
        });
        length = list.data.length;

        for(let {sha} of list.data){
            const {data} = await repo.getSingleCommit(sha);
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

async function postIssue(gh,opts){
    const issues = gh.getIssues(opts.owner,opts.repo);
    await issues.createIssue({
        title: opts.title,
        body: opts.body
    });
}