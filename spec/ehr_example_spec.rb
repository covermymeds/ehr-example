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
      visit '#/patients' # To test the home link visit another page besides the home page
      click_link('Home')
      page.should have_content('pretend that this is your EHR...')
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

    it 'should navigate to the CoverMyMeds API page', js: true do
      click_link('Resources')
      click_link('API Documentation')
      current_url.should eql('https://api.covermymeds.com/#overview')
    end

    it 'should navigate to CoverMyMeds api doc with link on main page', js: true do
      click_link('CoverMyMeds API')
      current_url.should eql('https://api.covermymeds.com/')
    end

    it 'should show the patients list by clicking button on home page', js: true do
      click_link('Start Patient Appointment')
      page.should have_content('Patients')
    end

    it 'should show the dashboard by clicking button on the home page', js: true do
      click_link('Show all Prior Authorizations')
      page.should have_content('Your Dashboard')
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
      page.should have_selector('.table')
      page.should have_css('.table tr.patients', count: 10)
    end

    it 'should navigate to new prescription form if patient is clicked with no prescriptions assigned', js: true do
      within '.table tr.patients:nth-child(2)' do
        find('a', match: :first).click
      end
      page.should have_content('New Prescription')
    end

    it 'should delete a patient if remove button is clicked', js: true do
      within '.table' do
        click_link('X', match: :first)
      end
      page.should have_css('.table tr.patients', count: 9)
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
      within '.table tr.patients:nth-child(2)' do
        find('a', match: :first).click
      end

      # Find a drug
      find('#s2id_drug').click
      find('.select2-input').set('Nexium')
      page.should have_selector('.select2-result-selectable')
      within '.select2-results' do
        find('li:first-child').click
      end

      # Find a form
      # find('#s2id_form').click
      # find('.select2-input').set('bcbs')
      # page.should have_selector('.select2-result-selectable')
      # within '.select2-results' do
      #   find('li:first-child').click
      # end

      click_on('Save')

      # Back on the patient page
      page.should have_selector('#patient-show')

      check('request', match: :first)

      click_on('Next')

      # Should be on pharmacy list page
      page.should have_selector('#pharmacies-list')
      click_on('Finish')

      page.should have_content('pretend that this is your EHR...')
    end

    it 'should navigate patient show if patient name is clicked and patient has prescription assigned', js: true do
      visit '/#/patients'

      within '.table tr.patients:nth-child(2)' do
        find('a', match: :first).click
      end

      # Find a drug
      find('#s2id_drug').click
      find('.select2-input').set('Nexium')
      page.should have_selector('.select2-result-selectable')
      within '.select2-results' do
        find('li:first-child').click
      end

      # Find a form
      # find('#s2id_form').click
      # find('.select2-input').set('bcbs')
      # page.should have_selector('.select2-result-selectable')
      # within '.select2-results' do
      #   find('li:first-child').click
      # end

      click_on('Save')

      visit '/#/patients'

      within '.table tr.patients:nth-child(2)' do
        find('a', match: :first).click
      end

      page.should have_content('Prescriptions')
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

