ENV['RACK_ENV'] = 'test'
require File.expand_path '../../server.rb', __FILE__

require 'rspec'
require 'rack/test'
require 'capybara'
require 'capybara/dsl'
require 'capybara/rspec'
require 'capybara-webkit'

module RSpecMixin
  include Rack::Test::Methods
  def app() Sinatra::Application end
end

Capybara.app = Sinatra::Application
Capybara.javascript_driver = :webkit
#Capybara.default_wait_time = 5

RSpec.configure do |config|
  config.include RSpecMixin
  config.include Capybara::DSL
end
