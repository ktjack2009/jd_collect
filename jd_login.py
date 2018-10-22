import requests
import random
import re
from lxml import html
import execjs
from generate_function import generate_eid, generate_d

session = requests.Session()
headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
}


def get_pubKey_sq_token():
    url = 'https://passport.jd.com/new/login.aspx'
    r = session.get(url, headers=headers, verify=False)
    root = html.fromstring(r.text)
    pubKey = root.xpath('//*[@id="pubKey"]/@value')[0]
    sa_token = root.xpath('//*[@id="sa_token"]/@value')[0]
    uuid = root.xpath('//*[@id="uuid"]/@value')[0]
    return pubKey, sa_token, uuid


def get_seqSid():
    url = 'https://seq.jd.com/jseqf.html?bizId=passport_jd_com_login_pc&platform=js&version=1'
    r = session.get(url, headers=headers, verify=False)
    seqSid = re.compile('sessionId="(.+?)"').findall(r.text)[0]
    return seqSid


def get_authcode_c(eid):
    url = 'https://iv.jd.com/slide/g.html'
    payload = {
        'appId': '1604ebb2287',
        'scene': 'login',
        'product': 'bind-suspend',
        'e': eid,
        'callback': '',
    }
    r = session.get(url, params=payload, verify=False)
    return r.json()['challenge']


def get_authcode(d, c, eid, seqSid, username):
    url = 'https://iv.jd.com/slide/s.html'
    payload = {
        'd': d,
        'c': c,
        'w': '0',
        'appId': '1604ebb2287',
        'scene': 'login',
        'product': 'bind-suspend',
        'e': eid,
        's': seqSid,
        'o': username,
        'callback': '',
    }
    r = session.get(url, params=payload, verify=False)
    print(r.text)
    return r.json()['validate']


# 返回值有 authcode


def encrypt(key, pwd):
    obj = execjs.compile(open('./jd_rsa.js').read())
    password = obj.call('encryptStr', key, pwd)
    return password


def login(uuid, eid, authcode, pubKey, sa_token, seqSid, username, password):
    url = 'https://passport.jd.com/uc/loginService'
    data = {
        'uuid': uuid,
        'eid': eid,
        'fp': '',
        '_t': '_t',
        'loginType': 'c',
        'loginname': username,
        'nloginpwd': encrypt(pubKey, password),
        'authcode': authcode,
        'pubKey': pubKey,
        'sa_token': sa_token,
        'seqSid': seqSid,
        'useSlideAuthCode': '1',
    }
    payload = {
        'uuid': uuid,
        'r': random.random(),
        'version': '2015',
    }
    r = session.post(url, params=payload, data=data, verify=False)
    print(r.text)


def get_info():
    r = session.get('http://i.jd.com/user/info')
    print(r.text)


if __name__ == '__main__':
    username = ''
    password = ''
    eid = generate_eid()
    pubKey, sa_token, uuid = get_pubKey_sq_token()
    seqSid = get_seqSid()
    challenge = get_authcode_c(eid)
    d = generate_d()
    validate = get_authcode(d, challenge, eid, seqSid, username)
    # login(uuid, eid, validate, pubKey, sa_token, seqSid, username, password)
    # get_info()
