# from flask import request, session
import requests
import requests.utils
import json
from tqdm import tqdm

class FangtaiDong:
    def __init__(self, username="fangtaid", password="fangtaid"):
        self.username = username
        self.password = password

        # initialize a session object
        self.session_create()
        self.login()

        

    # creat session
    def session_create(self):
        s = requests.Session()
        # s.get()
        self.session = s
    
    # login
    def login(self):
        print("Login Start ...")
        url = "http://assignment-code-warriors.unimelb.life/auth.php"
        body_data = {"user":self.username, "pass":self.password}

        # use session object to send post request to the sever
        self.session.post(url, data=body_data)
        
        print("Successfully login ...")
        
        # get Cookie and transfer to dict and pring as string
        cookie_dict = requests.utils.dict_from_cookiejar(self.session.cookies)
        cookie_str = json.dumps(cookie_dict)

        print(cookie_str)


FangtaiDong()