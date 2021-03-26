import core from '@actions/core';
import {checkRepo} from '@tracker';

(async ()=>{
    try {
        const [owner,repo] = process.env['GITHUB_REPOSITORY'].split('/');
        const workflow_id = process.env['GITHUB_WORKFLOW'];
        const opts = {
            token: core.getInput('token'),
            srcOwner: core.getInput('owner'),
            srcRepo: core.getInput('repo'),
            srcDir: core.getInput('dir'),
            title: core.getInput('title'),
            max_period: core.getInput('days'),
            dstOwner: owner,
            dstRepo: repo,
            workflow_id
        }
        await checkRepo(opts);
      } catch (error) {
        core.setFailed(error.message);
      }
})()
