ENV['RACK_ENV'] = 'test'
require File.expand_path '../../server.rb', __FILE__

require 'rspec'
require 'rack/test'

module RSpecMixin
  include Rack::Test::Methods
  def app() Sinatra::Application end
end

RSpec.configure { |c| c.include RSpecMixin }
