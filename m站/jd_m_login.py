import requests
import random
import execjs
import re
import json


def get_image():
	# 获取图形码（一般不需要）
	url = 'https://plogin.m.jd.com/cgi-bin/m/authcode?mod=login&v={}'.format(random.random())
	r = session.get(url)
	with open('./jd.png', 'wb') as f:
		f.write(r.content)


def login(username, password):
	# 登录
	obj = execjs.compile(open('rsa.js').read())
	
	# 初始化页面，获取s_token rsa_str
	url = 'https://plogin.m.jd.com/user/login.action?appid=461'
	r = session.get(url)
	s_token = re.compile("str_kenString = '(.+?)'").findall(r.text)[0]
	rsa_str = re.compile("str_rsaString = '(.+?)'").findall(r.text)[0]
	url = 'https://plogin.m.jd.com/cgi-bin/m/domlogin'
	data = {
		'authcode': '',
		'dat': '',
		'pwd': obj.call('encode_userinfo', rsa_str, password),	# rsa加密
		'remember': 'false',
		'risk_jd[eid]': '',
		'risk_jd[fp]': '',
		'risk_jd[token]': '',
		's_token': s_token,
		'username': obj.call('encode_userinfo', rsa_str, username), # rsa加密
		'wlfstk_datk': '',}
	r = session.post(url, data=data)
	if r.json().get('errcode') == 0:
		print('登录成功')
		return True
	else:
		print(r.text)
		if u'短信' in r.text:
			url0 = r.json().get('succcb')
			session.get(url0)
			# 发送短信
			url = 'https://plogin.m.jd.com/cgi-bin/ml/sms_risk_send'
			r = session.post(url)
			print(r.text)
			sms_code = input('sms:')
			url = 'https://plogin.m.jd.com/cgi-bin/ml/sms_risk_verify'
			data = {'authcode': sms_code}
			r = session.post(url, data=data)
			print(r.text)
			if r.json().get('err_code') == 0:
				print('登录成功')
				return True
			else:
				print('登录失败')
				return False
		else:
			print('异常提示')
			return False


def get_sid():
	session.get('https://home.m.jd.com/myJd/home.action')
	sid = session.cookies.get_dict().get('sid')
	return sid


def get_import_cookie():
	# 获取关键cookie
	session.get('https://wq.jd.com/mlogin/mpage/Login?rurl=https://home.m.jd.com/myJd/newhome.action')


def get_info():
	sid = session.cookies.get_dict().get('sid')
	# 可以拿到curPin levelName(用户等级) isVerified(是否实名) nickname isPlus jvalue(京享值)
	r = session.get('https://home.m.jd.com/myJd/newhome.action')

	# 获取pin userlevel nickname 头像 levelname email phone
	url = 'https://wq.jd.com/user/info/GetUserAllPinInfo?callback=userInfoCallBack'
	headers = {'Referer': 'https://wqs.jd.com/my/accountv2.shtml'}
	r = session.get(url, headers=headers)

	# 获取实名信息
	url = 'https://msc.jd.com/auth/loginpage/wcoo/toAuthInfoPage'
	payload = {'sid': sid,'source': '4'}
	r = session.get(url, params=payload)

	# 白条额度
	url = 'https://ms.jr.jd.com/gw/generic/bt/h5/m/getBalanceDetailListInfo'
	r = session.get(url)

	# 白条可用额度
	r = session.get('https://btm.jd.com/m/getAccountInfo')

	# 收货地址
	url = 'https://wq.jd.com/deal/recvaddr/getrecvaddrlistV3?g_ty=ls'
	headers = {'Referer': 'https://wqs.jd.com/my/my_address.shtml?sid={}'.format(sid)}
	r = session.get(url, headers=headers)


def main():
	username = ''
	password = ''
	if login(username, password):
		sid = get_sid()
		get_import_cookie()
		get_info()
	else:
		exit()

if __name__ == '__main__':
	session = requests.Session()
	main()
