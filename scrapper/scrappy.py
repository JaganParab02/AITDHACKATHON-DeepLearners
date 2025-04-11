# scrape.py
def scrape_linkedin_jobs(USERNAME, PASSWORD, preference):
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.chrome.service import Service
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.common.exceptions import TimeoutException
    from selenium.webdriver.common.keys import Keys
    from selenium_stealth import stealth

    import time

    chrome_options = Options()
    chrome_options.add_argument("--start-maximized")
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_argument("user-agent=Mozilla/5.0")
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option('useAutomationExtension', False)
    # chrome_options.add_argument("--headless")

    service = Service('D:/chromedriver-win64/chromedriver.exe')  # Path
    driver = webdriver.Chrome(service=service, options=chrome_options)
    wait = WebDriverWait(driver, 15)

    stealth(driver,
        languages=["en-US", "en"],
        vendor="Google Inc.",
        platform="Win32",
        webgl_vendor="Intel Inc.",
        renderer="Intel Iris OpenGL Engine",
        fix_hairline=True,
    )

    def wait_if_captcha():
        if "captcha" in driver.current_url:
            input("⚠️ CAPTCHA detected. Solve it and press Enter...")

    def login():
        driver.get("https://www.linkedin.com/login")
        wait.until(EC.presence_of_element_located((By.ID, "username"))).send_keys(USERNAME)
        driver.find_element(By.ID, "password").send_keys(PASSWORD)
        driver.find_element(By.XPATH, "//button[@type='submit']").click()
        wait_if_captcha()

    def scrape_jobs():
        driver.get("https://www.linkedin.com/jobs/")
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[aria-label='Search by title, skill, or company']")))
        job_input = driver.find_element(By.CSS_SELECTOR, "input[aria-label='Search by title, skill, or company']")
        job_input.clear()
        job_input.send_keys(preference)
        job_input.send_keys(Keys.ENTER)

        try:
            wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, ".scaffold-layout__list-item")))
        except TimeoutException:
            return []

        time.sleep(3)
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(2)

        job_cards = driver.find_elements(By.CSS_SELECTOR, ".scaffold-layout__list-item")

        results = []

        for job_card in job_cards:
            try:
                title_elem = job_card.find_element(By.CSS_SELECTOR, ".job-card-container__link")
                job_title = title_elem.text.strip()
                job_url = title_elem.get_attribute('href')
                job_id = job_url.split("/view/")[1].split("/")[0].split("?")[0]

                company = job_card.find_element(By.CSS_SELECTOR, ".artdeco-entity-lockup__subtitle").text.strip()
                location = job_card.find_element(By.CSS_SELECTOR, ".job-card-container__metadata-wrapper li").text.strip()

                salary = "N/A"
                metadata_items = job_card.find_elements(By.CSS_SELECTOR, ".artdeco-entity-lockup__metadata li")
                if metadata_items:
                    salary = metadata_items[-1].text.strip()

                easy_apply = "Easy Apply" in job_card.text
                if easy_apply:
                    results.append({
                        "title": job_title,
                        "company": company,
                        "location": location,
                        "salary": salary,
                        "easy_apply": bool(easy_apply),
                        "job_id": job_id,
                        "link": job_url
                    })

            except Exception:
                continue

        driver.quit()
        return results

    login()
    return scrape_jobs()

def auto_apply_to_job(job_url, user_details,job_id):
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.chrome.service import Service
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium_stealth import stealth

    import time

    chrome_options = Options()
    chrome_options.add_argument("--start-maximized")
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_argument("user-agent=Mozilla/5.0")
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option('useAutomationExtension', False)
    # chrome_options.add_argument("--headless")  # Run in headless mode for background processing

    service = Service('D:/chromedriver-win64/chromedriver.exe')
    driver = webdriver.Chrome(service=service, options=chrome_options)
    wait = WebDriverWait(driver, 15)

    stealth(driver, languages=["en-US", "en"], vendor="Google Inc.", platform="Win32", webgl_vendor="Intel Inc.", renderer="Intel Iris OpenGL Engine", fix_hairline=True)

    USERNAME = user_details["linkedin_username"]
    PASSWORD = user_details["linkedin_password"]

    def wait_if_captcha():
        if "captcha" in driver.current_url:
            input("⚠️ CAPTCHA detected. Solve it and press Enter...")


    driver.get("https://www.linkedin.com/jobs/search/?currentJobId="+job_id)

    driver.find_element(By.CLASS_NAME, "sign-in-modal__outlet-btn").click()
    
    wait.until(EC.presence_of_element_located((By.ID, "base-sign-in-modal_session_key"))).send_keys(USERNAME)
    driver.find_element(By.ID, "base-sign-in-modal_session_password").send_keys(PASSWORD)
    
    driver.find_element(By.CLASS_NAME, "sign-in-form__submit-btn--full-width").click()
    # wait_if_captcha()

    # login()
    
    try:
        
        easy_apply_button = wait.until(EC.element_to_be_clickable((By.ID, "jobs-apply-button-id")))
        easy_apply_button.click()

        # Fill form fields using WebDriverWait instead of time.sleep()
        first_name_input_id = wait.until(EC.presence_of_element_located((By.ID, "first_name_input_id")))
        last_name_input_id = wait.until(EC.presence_of_element_located((By.ID, "last_name_input_id")))
        country_code_id = wait.until(EC.presence_of_element_located((By.ID, "country_code_id")))
        mobile_number_id = wait.until(EC.presence_of_element_located((By.ID, "mobile_number_id")))
        email_input_id = wait.until(EC.presence_of_element_located((By.ID, "email_input_id")))
        location_input_id = wait.until(EC.presence_of_element_located((By.ID, "location_input_id")))
        
        first_name_input_id.send_keys(user_details["first_name"])
        last_name_input_id.send_keys(user_details["last_name"])
        country_code_id.send_keys(user_details["country_code"])
        mobile_number_id.send_keys(user_details["mobile"])
        email_input_id.send_keys(user_details["email"])
        location_input_id.send_keys(user_details["location"])
        
        
        # Select location or dropdown (if applicable)
        wait.until(EC.element_to_be_clickable((By.ID, "triggered-expanded-ember1256")))
        driver.find_element((By.ID, "triggered-expanded-ember1256")).click()

        # Click next
        wait.until(EC.element_to_be_clickable((By.ID, "ember1257"))).click()
        driver.find_element((By.ID, "ember1257")).click()

        # Upload resume
        wait.until(EC.presence_of_element_located((By.ID, "jobs-document-upload-file-input-upload-resume"))).send_keys(user_details["resume_path"])

        # Click review or submit button if applicable
        
        # wait.until(EC.element_to_be_clickable((By.ID, "ember1264"))).click()
        # wait.until(EC.element_to_be_clickable((By.ID, "ember1274"))).click()

        print(f"✅ Applied to job: {job_url}")

    except Exception as e:
        print(f"❌ Could not apply to job: {job_url}, reason: {str(e)}")
    finally:
        None
        # driver.quit()
