Vagrant::Config.run do |config|
  config.vm.box = "oneiric32"
  config.vm.box_url = "https://s3.amazonaws.com/mdellanoce-vagrant-boxes/oneiric32.box"
  
  config.vm.customize do |vm|
    vm.memory_size = 613
  end

  config.vm.forward_port "http", 80, 8080

  config.vm.provision :chef_solo do |chef|
    chef.recipe_url = "http://cloud.github.com/downloads/mdellanoce/cookbooks/cookbooks.tar.gz"
    chef.cookbooks_path = [:vm, "cookbooks"]
    
    chef.add_recipe "vim"
    chef.add_recipe "haproxy"
    chef.add_recipe "redis"
    chef.add_recipe "monit"
    chef.add_recipe "nodejs"
    chef.add_recipe "nodejs::canvas"
  end
end
