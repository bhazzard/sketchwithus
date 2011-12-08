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

# Monitoring

Wherever you have the code checked out run:

<pre>
sudo ./install.sh
</pre>

This will configure scripts for upstart and monit. At this point
the site should already be running. To test monit:

<pre>
ps aux | grep node
</pre>

Note the process ID for sketchwithus...

<pre>
kill -9 PID
</pre>

Then wait 15 seconds and sketchwithus should start up again:

<pre>
watch -n 1 "ps aux | grep node"
</pre>

Within 15 seconds, node should pop up into the list.

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

Vagrant will attempt to download the cookbooks automatically. If you are running vagrant on Windows
[this won't work](https://github.com/mitchellh/vagrant/issues/532). You'll need to modify the Vagrantfile to
load the cookbooks from the "cookbooks" path instead, then grab the Chef cookbooks from Github:

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

The project is mounted at /vagrant in the VM. For reasons that I don't understand, you will not be able to run
npm install from /vagrant (something about it being a shared folder). So the recommended workflow is to make
code changes on the host and run the app from the guest so that you know you are running on a production-like
environment.
