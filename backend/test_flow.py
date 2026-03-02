import urllib.request
import urllib.error
import urllib.parse
import json
import time

BASE_URL = "http://localhost:8081/api/v1"

def request(method, path, data=None, token=None):
    url = BASE_URL + path
    headers = {'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    
    body = None
    if data:
        body = json.dumps(data).encode('utf-8')
    
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode('utf-8')
            if res_body:
                return response.status, json.loads(res_body)
            return response.status, None
    except urllib.error.HTTPError as e:
        res_body = e.read().decode('utf-8')
        try:
            return e.code, json.loads(res_body)
        except:
            return e.code, res_body

print("Logging in as student (ogrenci1@loseven.com)...")
status, data = request("POST", "/auth/login", {"email": "ogrenci1@loseven.com", "password": "123456"})
student_token = data["token"]

print("Creating activity...")
status, act = request("POST", "/activities", {
    "title": "Clean Park",
    "description": "Cleaned the local park",
    "hours": 5,
    "eventDate": "2024-03-10T10:00"
}, student_token)
print(status, act)
activity_id = act["id"]

print("Logging in as Teacher 1 (ogretmen1@loseven.com)...")
status, data = request("POST", "/auth/login", {"email": "ogretmen1@loseven.com", "password": "123456"})
teacher1_token = data["token"]

print("Checking pending activities for Teacher 1...")
status, pending_t1 = request("GET", "/activities/pending", None, teacher1_token)
print("Pending for Teacher 1:", pending_t1)

print("Logging in as Teacher 2 (ogretmen2@loseven.com) from another school...")
status, data = request("POST", "/auth/login", {"email": "ogretmen2@loseven.com", "password": "123456"})
teacher2_token = data["token"]
status, pending_t2 = request("GET", "/activities/pending", None, teacher2_token)
print("Pending for Teacher 2:", pending_t2)

# Teacher 1 approves
print("Teacher 1 trying to approve activity...")
status, approve_res = request("POST", f"/activities/{activity_id}/approve", None, teacher1_token)
print("Approve response:", status, approve_res)

# Student registers
print("Student registering for activity...")
status, reg_res = request("POST", "/participations", {"activityId": activity_id}, student_token)
print("Register response:", status, reg_res)
participation_id = reg_res["id"]

# Student completes
print("Student completing activity...")
status, comp_res = request("PATCH", f"/participations/{participation_id}/complete", {
    "mediaUrl": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600",
    "comment": "It was amazing!"
}, student_token)
print("Complete response:", status, comp_res)

# Fetch Posts
print("Fetching posts to verify Community integration...")
status, posts_res = request("GET", "/posts", None, student_token)
print("Posts response:", status, posts_res)
