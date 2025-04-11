from flask import Flask, request, jsonify
from flask_cors import CORS
from scrappy import scrape_linkedin_jobs, auto_apply_to_job

app = Flask(__name__)
CORS(app)

job_data = []  # Cache scraped jobs temporarily
pending_index = 0  # Track current job to verify


@app.route('/scrape', methods=['POST'])
def scrape():
    global job_data, pending_index
    data = request.get_json()
    # print(data)
    print(data.get('linkedin_username'))
    print(data.get('linkedin_password'))
    
    username = data.get('linkedin_username')
    password = data.get('linkedin_password')
    preference = data.get('preference')

    if not all([username, password, preference]):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        job_data = scrape_linkedin_jobs(username, password, preference)
        pending_index = 0
        if job_data:
            return jsonify({'jobData': job_data[1]})
        else:
            return jsonify({'message': 'No jobs found'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/verify', methods=['POST'])
def verify_job():
    global pending_index
    data = request.get_json()
    decision = data.get('decision')  # true or false
    user_details = data.get('user_details')  # Get user details from frontend

    if decision is None or pending_index >= len(job_data):
        return jsonify({'flag': 0}), 200

    if decision:
        full_data = job_data[pending_index]
        curr_job_id = full_data['job_id']
        pending_index += 1
        next_id = job_data[pending_index]['job_id'] if pending_index < len(job_data) else None

        # Execute auto_apply_to_job if decision is true
        job_url = full_data['link']
        if auto_apply_to_job(job_url, user_details,curr_job_id):
            if next_id is None:
                return jsonify({'approved': True, 'job': full_data, 'next_job_id': None})

            return jsonify({'approved': True, 'job': full_data, 'next_job_id': next_id})
        else:
            return jsonify({'error': 'Failed to apply to job'}), 500

    else:
        pending_index += 1
        next_id = job_data[pending_index]['job_id'] if pending_index < len(job_data) else None
        return jsonify({'approved': False, 'next_job_id': next_id})


if __name__ == '__main__':
    app.run(port=5000)
