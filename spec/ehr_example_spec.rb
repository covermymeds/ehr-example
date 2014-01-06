require File.expand_path '../spec_helper.rb', __FILE__

describe 'eHR Example App' do

  it 'should allow accessing the site root' do
    get '/'
    last_response.should be_ok
  end

  it 'should display a help view', js: true do
    visit '/'
    find_link('Prior Authorization').click
    find_link('Contact CoverMyMeds').click
    page.should have_content('For assistance using CoverMyMeds')
  end

end
