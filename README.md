# Setting up

This guide is written assuming you are developing on Ubuntu. The first step is to install everything we need to run node.js:

<pre>
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install build-essential python-software-properties libssl-dev libreadline-dev git-core curl
</pre>

Next, install NVM:

<pre>
git clone git://github.com/creationix/nvm.git ~/.nvm
echo ". ~/.nvm/nvm.sh" >> .bashrc
</pre>

Now close your terminal and open a new one. The nvm command should be on your path.

Finally, install node.js:

<pre>
nvm install v0.4.12
</pre>

That's it!

# Getting started

Check out the code:

<pre>
git clone git@github.com:mdellanoce/sketchwithus.git
</pre>

Install the packages:

<pre>
cd sketchwithus
npm install
</pre>

Run the app:

<pre>
node app.js
</pre>

Point your browser to http://localhost:8000
