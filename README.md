# track-commits-to-issue

Github Action to load commits list from one repo and make the issue with list of changed files in your repo

## Why you may need it?

I maintain russian translation of the official Svelte site. I needed tracking changes in english site to apply same in our translated one. So I created this action, it grab all the commits in source repository(or even in its subdirectory only)  which was done in the period from the moment when action was ran last time, then post a list of changed files as an issue in target repository(in which action runs).

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
- `hours` - optional, set number of hours from what time to retrieve commits when action runs first time. Default 24
