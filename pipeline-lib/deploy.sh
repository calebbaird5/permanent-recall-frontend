#!/bin/bash

# any future command that fails will exit the script
set -e

mkdir -p ~/.ssh
touch ~/.ssh/config
echo -e "Host *\n\tStrictHostKeyChecking no\n\n" >> ~/.ssh/config
touch ~/.ssh/known_hosts

# ** Alternative approach
# echo -e "$PRIVATE_KEY" > /root/.ssh/id_rsa
# chmod 600 /root/.ssh/id_rsa
# ** End of alternative approach

# disable the host key checking.


chmod 644 ~/.ssh/known_hosts
eval $(ssh-agent -s)

echo 'before downloading private files'
# Lets write the public key of our aws instance
# curl --silent "https://gitlab.com/gitlab-org/bicodetech/permanent-recall-frontend/download-secure-files/-/raw/main/installer" | bash
echo "$DEPLOY_KEY" | tr -d '\r' | ssh-add - > /dev/null

echo 'after downloading private files'



# echo .seure-files/permanent-recall.pem | tr -d '\r' | ssh-add - > /dev/null

# Use the gitlab variable for the ip address to deploy to.
DEPLOY_SERVER=$DEPLOY_SERVER

echo "deploying to ${DEPLOY_SERVER}"
echo "${DEPLOY_SERVER}" >> ~/.ssh/known_hosts

scp ./dist ec2-user@${DEPLOY_SERVER}:/home/ec2-user/html/permanent-recall-frontend


# ssh ec2-user@${DEPLOY_SERVER} bash -s - < ./deploy/cloneOrPull.sh
# echo "Sending the develop .env file"
# scp $DOTENV_DEVELOP ec2-user@${DEPLOY_SERVER}:/home/ec2-user/html/starter-app-${branch}-backend/.env
# echo "Sending the ecosystem file"
# scp $ECOSYSTEM_DEVELOP ec2-user@${DEPLOY_SERVER}:/home/ec2-user/html/starter-app-${branch}-backend/ecosystem.config.js

# ssh ec2-user@${DEPLOY_SERVER} bash -s - < ./deploy/updateAndRestart.sh "$branch $repo"
