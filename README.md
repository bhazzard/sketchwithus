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

An optional, but recommended, step is also to set your default node.js version. Otherwise, you will have to select which version to use every time you open a new terminal:

<pre>
nvm alias default v0.4.12
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

Modify your hosts file:

<pre>
127.0.0.1       sketchwith.us
</pre>

Point your browser to http://sketchwith.us:8000

Optionally, open another browser instance and point it to the same location. Draw on the canvas,
your drawing should show up in the other browser window in real-time.
