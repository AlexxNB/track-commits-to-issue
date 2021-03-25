# track-commits-to-issue

Github Action to load commits list from one repo and make the issue with list of changed files in your repo

## Why you may need it?

I maintain russian translation of the official Svelte site. I needed tracking changes in english site to apply same in our translated one. So I created this action, it run once a day and grab all the commits that was done las 24h in source repository(or even in its subdirectory only) and post a list of changed files as an issue in target repository(in which action runs).

## Action workflow file:

```yml
name: Check remote repo for new commits

on:
  schedule:
    - cron:  '0 3 * * *'

jobs:
  track-commits:
    runs-on: ubuntu-latest
    name: Checking new commits...
    steps:
    - name: Checkout code
      uses: actions/checkout@v2
    - name: Checking new commits
      uses: AlexxNB/track-commits-to-issue@master
      with:
        token: ${{ secrets.GITHUB_TOKEN }}
        owner: AlexxNB
        repo: track-comits-to-issue
        dir: src
```

### Inputs

- `token` - Use `${{ secrets.GITHUB_TOKEN }}` default token of the `actions-bot` and you will be able tracking any public repository. Or you can get [personal token](https://github.com/settings/tokens) (with repository permission) and track any public or private repo where you have access. Don't write your token in workflow file directly – use repo's _Settings-Secrets_!
- `owner` - owner of watching repo
- `repo` - name of the of watching repo
- `dir` - optional, watch only a subdirectory of the repo. It should be relative path to target directory from the root of repo – ex. `content/documentation`.

## Schedule

It is very important to run action once per 24 hours. Because we have not any way to store values between action's runs, so action just retrieve commits, which was pushed in last 24 hours from action starts.

This is example of cron schedule:

```yml
    - cron:  '0 3 * * *'
```
`0` and all `*` must be as is. You can change only `3` - and it may be only the number from `0` till `24` which is represent a hour of the day when action will be started. In our example it will check commits at `3:00 am` every day.