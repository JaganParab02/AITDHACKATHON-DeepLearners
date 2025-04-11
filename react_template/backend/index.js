require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Function to extract job_id from LinkedIn job URL
function extractJobIdFromUrl(url) {
  const match = url.match(/view\/(\d+)/);
  return match ? match[1] : null;
}

// Check if a job has been applied
async function checkJobApplied(jobId, userId) {
  const { data, error } = await supabase
    .from("applied_jobs")
    .select("*")
    .eq("job_id", jobId)
    .eq("user_id", userId);

  if (error) {
    console.error("Error checking job:", error.message);
    return false;
  }

  return data && data.length > 0;
}

// Route to auto-apply
app.post("/auto-apply", async (req, res) => {
  const { user_id } = req.body; // default user_id = 13 if not provided

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user_id)
    .single();

  if (error || !data) {
    console.error(
      "Error fetching user data:",
      error?.message || "User not found"
    );
    return res.status(500).json({ error: "User data fetch failed" });
  }

  const userDetails = {
    resumePath: data.resume_path,
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    mobile: data.mobile,
    linkedin_username: data.linkedin_username,
    linkedin_password: data.linkedin_password,
    preference: data.preference,
    countryCode: "+91",
    location: data.location,
  };

  try {
    const flaskResponse = await axios.post(
      "http://127.0.0.1:5000/scrape",
      userDetails,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    
    console.log("Job ID:", flaskResponse["data"]["jobData"]["job_id"]);
    const alreadyApplied = await checkJobApplied(
      flaskResponse["data"]["jobData"]["job_id"],
      user_id
    );
    if (alreadyApplied) return res.json({ decision: false });

    insertData = {
      user_id: user_id,
      job_id: flaskResponse["data"]["jobData"]["job_id"],
      job_title: flaskResponse["data"]["jobData"]["title"],
      company: flaskResponse["data"]["jobData"]["company"],
      location: flaskResponse["data"]["jobData"]["location"],
      //   resume_path: data.resume_path,
      link: flaskResponse["data"]["jobData"]["link"],
      salary: flaskResponse["data"]["jobData"]["salary"],
      preference: data.preference,
    };

    const { data: insertedData, error } = await supabase
      .from("applied_jobs")
      .insert([insertData]); // Wrap it in an array

    if (error) {
      console.error("Error inserting data:", error.message);
    } else {
      console.log("Data inserted:");

      const flaskReq = await axios.post(
        "http://127.0.0.1:5000/verify",
        {
          decision: true,
          user_details: {
            resumePath: data.resume_path,
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            mobile: data.mobile,
            linkedin_username: data.linkedin_username,
            linkedin_password: data.linkedin_password,
            preference: data.preference,
            countryCode: "+91",
            location: data.location,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  } catch (err) {
    console.error("Error calling Flask API:", err.message);
    res.status(500).json({ error: "Failed to call Flask API" });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
