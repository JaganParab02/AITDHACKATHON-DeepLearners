# LinkedIn Auto Apply Bot

This project automates LinkedIn job search and Easy Apply submissions using a Python Flask backend with Selenium and a React frontend. The backend handles job scraping and auto-application, while the frontend provides an interface for users to input preferences and approve or deny applications.

---

## 🔧 Technologies Used

### Backend:
- Python
- Flask
- Selenium (with stealth plugin)
- Flask-CORS

### Frontend:
- React.js
- Axios
- Supabase (for storing applied job data)

---

## 📁 Backend Setup

### Requirements:
- Python 3.8+
- Chrome + ChromeDriver

### Install dependencies:
```bash
pip install selenium flask flask-cors selenium-stealth
```

### Set your `chromedriver.exe` path in `scrape.py`:
```python
service = Service('D:/chromedriver-win64/chromedriver.exe')
```

### Run the Flask backend:
```bash
python scrape.py
```

---

## 🔍 API Endpoints

### `POST /scrape`
Scrapes LinkedIn jobs based on provided credentials and job preference.

#### Request Body:
```json
{
  "linkedin_username": "your_email",
  "linkedin_password": "your_password",
  "preference": "React Developer"
}
```
#### Response:
```json
{
  "jobData": {
    "title": "React Developer",
    "company": "XYZ Corp",
    "location": "Remote",
    "salary": "N/A",
    "easy_apply": true,
    "job_id": "123456",
    "link": "https://www.linkedin.com/jobs/view/123456"
  }
}
```

### `POST /verify`
Verifies if a job should be auto-applied.

#### Request Body:
```json
{
  "decision": true,
  "user_details": {
    "linkedin_username": "...",
    "linkedin_password": "...",
    "first_name": "...",
    "last_name": "...",
    "mobile": "...",
    "email": "...",
    "location": "...",
    "country_code": "+91",
    "resume_path": "path/to/resume.pdf"
  }
}
```
#### Response:
```json
{
  "approved": true,
  "job": { ... },
  "next_job_id": "987654"
}
```

---

## ⚛️ React Frontend (High-Level Overview)

### Features:
- Authenticated user login and session storage (user object in `localStorage`)
- Form to input LinkedIn credentials and job preference
- Displays scraped job one-by-one
- Sends decision (`true`/`false`) to Flask backend
- Saves applied jobs to Supabase `applied_jobs` table

### Storing Job in Supabase
```js
const insertData = {
  user_id: JSON.parse(localStorage.getItem('user')).id,
  job_id: flaskResponse.data.jobData.job_id,
  job_title: flaskResponse.data.jobData.job_title,
  company: flaskResponse.data.jobData.company_name,
  location: flaskResponse.data.jobData.location,
  link: flaskResponse.data.jobData.link,
  salary: flaskResponse.data.jobData.salary,
  preference: data.preference,
};

await supabase.from("applied_jobs").insert(insertData);
```

### LocalStorage User Extraction
```js
const user = JSON.parse(localStorage.getItem('user'));
const userId = user?.id;
```

---

## 🚀 Run the React App
Make sure you have Node.js installed.

```bash
npm install
npm start
```

---

## 🤖 Notes
- Ensure LinkedIn credentials are valid.
- LinkedIn may rate limit or CAPTCHA—manual input might be needed.
- Headless mode is commented for debugging, uncomment for deployment.

---

## 📌 TODO / Improvements
- Add CAPTCHA bypass detection handling
- Save resume path in Supabase for each user
- Add support for more complex multi-step applications
- Error logging and retry mechanism

---

Made with ❤️ for Hackathons & Internship Seekers!

