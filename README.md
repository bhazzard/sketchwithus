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

# Using [Vagrant](http://vagrantup.com)

Follow the vagrant [setup instructions](http://vagrantup.com/docs/getting-started/index.html) for your platform.
Check out the code:

<pre>
git clone git@github.com:mdellanoce/sketchwithus.git
</pre>

Grab the Chef cookbooks:

<pre>
cd sketchwithus
git clone git@github.com:mdellanoce/cookbooks.git
</pre>

Boot the VM:

<pre>
vagrant up
</pre>

Login to the VM. If you are running vagrant on windows, see [vagrant-putty](https://github.com/mdellanoce/vagrant-putty):

<pre>
vagrant ssh
</pre>

The project is mounted at /vagrant in the VM. You can do your work from that directory and commit your changes from
the host OS as you go.