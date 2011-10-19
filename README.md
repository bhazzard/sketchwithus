# Setting up

This guide is written assuming you are developing on Ubuntu. The first step is to install everything we need to run node.js:

<pre>
sudo add-apt-repository ppa:chris-lea/node.js -y
sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get install build-essential python-software-properties libssl-dev libreadline-dev git-core curl libcairo2-dev -y
sudo apt-get install nodejs nodejs-dev
</pre>

Next, install NPM:

<pre>
git clone git://github.com/isaacs/npm.git
cd npm
sudo make install
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
node app.js --sketchpad --image
</pre>

Modify your hosts file:

<pre>
127.0.0.1       sketchwith.us
</pre>

Point your browser to http://sketchwith.us:8000
Click the Start Sketchin' link, and start drawing.

Optionally, open another browser instance and point it to the same location as the first browser.
Draw on the canvas, your drawing should show up in the other browser window in real-time.
