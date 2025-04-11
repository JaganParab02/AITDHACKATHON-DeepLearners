document.getElementById("getCookie").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "getCookie" }, (response) => {
      if (response.li_at) {
        document.getElementById("output").innerText = "li_at: " + response.li_at;
  
        // 🔄 Send cookie to your backend
        fetch("http://127.0.0.1:5000/scrape", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ li_at: response.li_at })
        })
        .then(res => res.json())
        .then(data => {
          console.log("Scraped jobs:", data);
          document.getElementById("output").innerText += "\n\nTop Jobs:\n" + 
            data.jobs.map(job => `• ${job.title} at ${job.company} (${job.location})`).join("\n");
        })
        .catch(err => {
          console.error(err);
          document.getElementById("output").innerText += "\nFailed to send to backend.";
        });
  
      } else {
        document.getElementById("output").innerText = "Failed to get cookie.";
      }
    });
  });
  