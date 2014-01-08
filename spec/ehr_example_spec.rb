require File.expand_path '../spec_helper.rb', __FILE__

describe 'eHR Example App' do

  # Test all of the nav links
  describe 'navigating the site via nav bar' do

    before(:each) do
      visit '/'
    end

    it 'should navigate to the patients view', js: true do
      click_link('e-Prescribing')
      page.should have_content('Patients')
    end

    it 'should navigate to the home view', js: true do
      visit '/#/patients' # To test the home link visit another page besides the home page
      click_link('Home')
      page.should have_content('Lets pretend that this is your EHR...')
    end

    it 'should navigate to the dashboard view', js: true do
      click_link('Prior Authorization')
      click_link('Task List')
      page.should have_content('Your Dashboard')
    end

    it 'should navigate to the new prior auth view', js: true do
      click_link('Prior Authorization')
      click_link('New Prior Authorization')
      page.should have_content('First Name')
    end

    it 'should navigate to the contact cmm view', js: true do
      click_link('Prior Authorization')
      click_link('Contact CoverMyMeds')
      page.should have_content('For assistance using CoverMyMeds')
    end

  end

  # Test everything a user can do on the patients index
  describe 'patients index workflow' do

    before(:each) do
      visit '/#/patients'
    end

    it 'should allow accessing patients index directly', js: true do
      page.should have_content('Patients')
    end

    it 'clicking add patient should direct user to patients new view', js: true do
      click_link('Add patient')
      page.should have_content('First Name')
    end

    it 'should create ten default patients by default', js: true do
      page.should have_selector('.list-group li')
      page.should have_css('.list-group li', count: 10)
    end

    it 'should navigate to new prescription form if patient is clicked with no prescriptions assigned', js: true do
      within '.list-group li:first-child' do
        find('a:first-child').click
      end
      page.should have_content('New Prescription')
    end

    it 'should navigate patient show if patient name is clicked and patient has prescription assigned', js: true do
      # TODO: Create a test for this - needs setup data
    end

    it 'should delete a patient if remove button is clicked', js: true do
      within '.list-group' do
        click_link('Remove', match: :first)
      end
      page.should have_css('.list-group li', count: 9)
    end

  end

  describe 'patients add workflow' do
    it 'should create a patient', js: true do
      visit '/#/patients/new'

      within 'fieldset' do
        fill_in('First Name', with: 'Example')
        fill_in('Last Name', with: 'Patient')
        fill_in('Date of Birth', with: '01/01/1970')
        find(:xpath, '//body').click # Use this to deactivate the datepicker
        select('Ohio', from: 'State')
        click_on('Create')
      end

      page.should have_content('Patient created successfully.')
    end

    it 'should add a drug to a patient', js: true do
      visit '/#/patients'

      # Find the first patient and click on them
      within '.list-group li:first-child' do
        find('a:first-child').click
      end

      # Find a drug
      find('#s2id_drug').click
      find('.select2-input').set('Nexium')
      page.should have_selector('.select2-result-selectable')
      within '.select2-results' do
        find('li:first-child').click
      end

      # Find a form
      find('#s2id_form').click
      find('.select2-input').set('bcbs')
      page.should have_selector('.select2-result-selectable')
      within '.select2-results' do
        find('li:first-child').click
      end
      save_screenshot('screen.png')
      click_on('Save')

      check('request')
      click_on('Next')
      sleep 6

    end
  end

  describe 'patients show workflow' do
    it 'should create a prescription for patient', js: true do
      visit '/#/patients'

      within '.list-group li:first-child' do
        find('a:first-child').click
      end

      within '#request-add' do
        fill_in('Drug', with: 'Nexium')
      end
      #page.should have_css('.select2-no-results', count: 0)
      #page.should have_selector('select2-result-selectable')
    end

  end

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

