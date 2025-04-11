import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Sidebar from "./Sidebar";
import "./AppliedJobs.css";
import axios from "axios";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const { data, error } = await supabase
          .from("applied_jobs")
          .select("*")
          .eq(
            "user_id",
            JSON.parse(localStorage.getItem("user"))["uesr_id"]
              ? JSON.parse(localStorage.getItem("user"))["uesr_id"]
              : 13
          )
          .order("created_at", { ascending: false });

        if (error) throw error;
        setAppliedJobs(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  const handleApplyJob = async (job) => {
    // console.log(JSON.parse(localStorage.getItem("user")));
    // return;
    try {
      const userId = JSON.parse(localStorage.getItem("user"))["user_id"] || 13;

      const userData = await axios.post("http://localhost:3001/auto-apply", {
        user_id: userId || 13,
      });

      console.log("Apply response:", userData);
    } catch (error) {
      console.error("Error applying for job:", error);
    }
  };

  if (loading) {
    return <div className="loading">Loading applied jobs...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="applied-jobs-container">
      <Sidebar />
      <div className="apply-job-button-div">
        <button onClick={handleApplyJob} className="apply-jobs-button">
          Apply For Jobs
        </button>
      </div>
      <div className="applied-jobs-content">
        <h1>Applied Jobs</h1>
        <div className="jobs-grid">
          {appliedJobs.length === 0 ? (
            <div className="no-jobs">No jobs applied yet.</div>
          ) : (
            appliedJobs.map((job) => (
              <div key={job.id} className="job-card">
                <div className="job-header">
                  <h2>{job.job_title}</h2>
                  <span className="company">{job.company}</span>
                </div>
                <div className="job-details">
                  <div className="detail">
                    <span className="label">Location:</span>
                    <span className="value">{job.location}</span>
                  </div>
                  <div className="detail">
                    <span className="label">Salary:</span>
                    <span className="value">{job.salary}</span>
                  </div>
                  <div className="detail">
                    <span className="label">Applied Date:</span>
                    <span className="value">
                      {new Date(job.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="detail">
                    <span className="label">Preference:</span>
                    <span className="value">{job.preference}</span>
                  </div>
                </div>
                <div className="job-actions">
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-job-btn"
                  >
                    View Job
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AppliedJobs;
