import dayjs from 'dayjs';

export function getMarkdown(opts){

    let result = `## List of new commits in [${opts.owner}/${opts.repo}](https://github.com/${opts.owner}/${opts.repo})\n\n`;

    for(let commit of opts.commits){
        result += `### [${dayjs.unix(commit.date).format('YYYY-MM-DD')}] [${commit.message}](${commit.url}) - _[${commit.author.name}](${commit.author.url})_\n\n`
        for(let file of commit.files){
            result += `- [${file.filename}](${file.diff_url})\n`
        }
    }

    return result;
}