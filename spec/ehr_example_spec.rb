require File.expand_path '../spec_helper.rb', __FILE__

describe 'eHR Example App' do

  it 'should allow accessing the site root' do
    get '/'
    last_response.should be_ok
  end

end
