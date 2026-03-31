import requests
import sys
from datetime import datetime

class SowberryAPITester:
    def __init__(self, base_url="https://595ff4e6-58fd-4fb2-8672-1b7007136eac.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=30)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if 'message' in response_data:
                        print(f"   Message: {response_data['message']}")
                except:
                    pass
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Response: {response.text[:200]}")
                self.failed_tests.append({
                    'name': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'endpoint': endpoint
                })

            return success, response.json() if response.headers.get('content-type', '').startswith('application/json') else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                'name': name,
                'error': str(e),
                'endpoint': endpoint
            })
            return False, {}

    def test_health_check(self):
        """Test API health check"""
        return self.run_test("Health Check", "GET", "api/health", 200)

    def test_public_courses(self):
        """Test public courses endpoint"""
        return self.run_test("Public Courses", "GET", "api/public/courses", 200)

    def test_login(self, username, password, role_name):
        """Test login and get token"""
        success, response = self.run_test(
            f"Login ({role_name})",
            "POST",
            "api/auth/login",
            200,
            data={"username": username, "password": password}
        )
        if success and response.get('success') and response.get('data', {}).get('token'):
            self.token = response['data']['token']
            user_data = response['data']['user']
            print(f"   Logged in as: {user_data.get('fullName')} ({user_data.get('role')})")
            return True, user_data
        return False, {}

    def test_auth_me(self):
        """Test getting current user info"""
        return self.run_test("Get Current User", "GET", "api/auth/me", 200)

    def test_admin_dashboard(self):
        """Test admin dashboard"""
        return self.run_test("Admin Dashboard", "GET", "api/admin/dashboard", 200)

    def test_student_dashboard(self):
        """Test student dashboard"""
        return self.run_test("Student Dashboard", "GET", "api/student/dashboard", 200)

    def test_mentor_dashboard(self):
        """Test mentor dashboard"""
        return self.run_test("Mentor Dashboard", "GET", "api/mentor/dashboard", 200)

    def test_student_courses(self):
        """Test student courses"""
        return self.run_test("Student Courses", "GET", "api/student/courses", 200)

    def logout(self):
        """Clear token"""
        self.token = None
        print("🔓 Logged out")

def main():
    print("🌱 Starting Sowberry Academy API Tests")
    print("=" * 50)
    
    tester = SowberryAPITester()
    
    # Test credentials from review request
    admin_creds = {"username": "sowadmin", "password": "Admin@123"}
    mentor_creds = {"username": "jayanthan_m", "password": "Mentor@123"}
    student_creds = {"username": "aarav_s", "password": "Student@123"}

    # 1. Test basic endpoints
    print("\n📋 TESTING BASIC ENDPOINTS")
    print("-" * 30)
    tester.test_health_check()
    tester.test_public_courses()

    # 2. Test Admin Login and Dashboard
    print("\n👑 TESTING ADMIN FUNCTIONALITY")
    print("-" * 30)
    admin_login_success, admin_user = tester.test_login(admin_creds["username"], admin_creds["password"], "Admin")
    if admin_login_success:
        tester.test_auth_me()
        tester.test_admin_dashboard()
        tester.logout()
    else:
        print("❌ Admin login failed, skipping admin tests")

    # 3. Test Mentor Login and Dashboard
    print("\n🎓 TESTING MENTOR FUNCTIONALITY")
    print("-" * 30)
    mentor_login_success, mentor_user = tester.test_login(mentor_creds["username"], mentor_creds["password"], "Mentor")
    if mentor_login_success:
        tester.test_auth_me()
        tester.test_mentor_dashboard()
        tester.logout()
    else:
        print("❌ Mentor login failed, skipping mentor tests")

    # 4. Test Student Login and Dashboard
    print("\n🎒 TESTING STUDENT FUNCTIONALITY")
    print("-" * 30)
    student_login_success, student_user = tester.test_login(student_creds["username"], student_creds["password"], "Student")
    if student_login_success:
        tester.test_auth_me()
        tester.test_student_dashboard()
        tester.test_student_courses()
        tester.logout()
    else:
        print("❌ Student login failed, skipping student tests")

    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 FINAL RESULTS")
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    print(f"Success rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.failed_tests:
        print(f"\n❌ Failed Tests ({len(tester.failed_tests)}):")
        for i, test in enumerate(tester.failed_tests, 1):
            print(f"  {i}. {test['name']}")
            if 'error' in test:
                print(f"     Error: {test['error']}")
            else:
                print(f"     Expected: {test['expected']}, Got: {test['actual']}")
            print(f"     Endpoint: {test['endpoint']}")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())