Vagrant::Config.run do |config|
  config.vm.box = "oneiric32"
  config.vm.url = "https://s3.amazonaws.com/mdellanoce-vagrant-boxes/oneiric32.box"
  
  config.vm.customize do |vm|
    vm.memory_size = 613
  end

  config.vm.forward_port "http", 80, 8080

  config.vm.provision :chef_solo do |chef|
    chef.cookbooks_path = "cookbooks"
    
    chef.add_recipe "vim"
    chef.add_recipe "nodejs"
    chef.add_recipe "nodejs::canvas"
  end
end
