#!/bin/bash
if [ "$GIT_COMMITTER_EMAIL" = "noreply@lovable.dev" ]
then
    export GIT_COMMITTER_NAME="Abhijeet Mishra"
    export GIT_COMMITTER_EMAIL="mishraabhijeet078@gmail.com"
    export GIT_AUTHOR_NAME="Abhijeet Mishra"
    export GIT_AUTHOR_EMAIL="mishraabhijeet078@gmail.com"
fi
