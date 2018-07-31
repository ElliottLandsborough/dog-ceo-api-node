# dog.ceo lambda api

## requirements

* aws account
* node

## how?

* npm install -g serverless
* npm install
* serverless offline start

## deployment

* serverless deploy

## todo

* refactor! (loads of repeated code)
* unit tests
* record stats somewhere

## Useful bash script

```
#!/bin/bash

# get the current git status
UPSTREAM=${1:-'@{u}'}
LOCAL=$(cd ~/dog-api-images; /usr/bin/git rev-parse @)
REMOTE=$(cd ~/dog-api-images; /usr/bin/git rev-parse "$UPSTREAM")
BASE=$(cd ~/dog-api-images; /usr/bin/git merge-base @ "$UPSTREAM")

if [ $LOCAL = $REMOTE ]; then
        echo "Up-to-date"
elif [ $LOCAL = $BASE ]; then
        echo "Need to pull"
        # pull the repo
        (cd ~/dog-api-images; /usr/bin/git fetch origin;);
        (cd ~/dog-api-images; /usr/bin/git reset --hard origin/master;);
        # sync the files to s3
        ~/s3cmd-2.0.1/s3cmd sync --skip-existing --delete-removed --exclude '.git*' --exclude 'LICENSE' --exclude '*.md' --include '*.jp*g' ~/dog-api-images/ s3://name-of-bucket
        # clear the cache on the remote server
        /usr/bin/curl -i -H "Accept: application/json" -H "Content-Type: application/json" "https://localhost:8000/clear-cache?key=something-really-secure-lol
        echo "Complete"
elif [ $REMOTE = $BASE ]; then
        echo "Need to push"
else
        echo "Diverged"
fi
```

## MIT License

Copyright (c) 2018 Dog CEO

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.