task default: %w[imageOptimize]
task :imageOptimize do
  puts "Compressing images... Grab a coffee"
  sh "image_optim -r --no-pngout --no-svgo ./images"
end