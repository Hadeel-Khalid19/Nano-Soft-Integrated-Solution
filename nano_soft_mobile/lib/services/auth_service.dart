import 'dart:convert';
import '../core/api_client.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  // تسجيل الدخول
  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await ApiClient.post('/auth/login', {
      'email': email,
      'password': password,
    });

    final data = jsonDecode(response.body);
    if (response.statusCode == 200 && data['token'] != null) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('nano_token', data['token']);
    }
    return data;
  }

  // إنشاء حساب
  Future<Map<String, dynamic>> register(Map<String, dynamic> userData) async {
    final response = await ApiClient.post('/auth/register', userData);
    return jsonDecode(response.body);
  }

  // التحقق من البيانات
  Future<Map<String, dynamic>> registerValidator(Map<String, dynamic> data) async {
    final response = await ApiClient.post('/auth/register-validator', data);
    return jsonDecode(response.body);
  }

  // إرسال كود التحقق
  Future<Map<String, dynamic>> sendVerification(String method, String identifier) async {
    final payload = {'method': method};
    if (method == 'email') {
      payload['email'] = identifier;
    } else {
      payload['mobile'] = identifier;
    }
    
    final response = await ApiClient.post('/auth/verify/send', payload);
    return jsonDecode(response.body);
  }

  // التحقق من الكود
  Future<Map<String, dynamic>> checkVerification(String method, String code, String identifier) async {
    final payload = {'method': method, 'code': code};
    if (method == 'email') {
      payload['email'] = identifier;
    } else {
      payload['mobile'] = identifier;
    }

    final response = await ApiClient.post('/auth/verify/check', payload);
    return jsonDecode(response.body);
  }

  // نسيت كلمة المرور
  Future<Map<String, dynamic>> forgotPassword(String mobile) async {
    final response = await ApiClient.post('/auth/forgot', {'mobile': mobile});
    return jsonDecode(response.body);
  }

  // استرداد الحساب
  Future<Map<String, dynamic>> recoverAccount(String mobile, String password, String code) async {
    final response = await ApiClient.post('/auth/recover', {
      'mobile': mobile,
      'password': password,
      'code': code,
    });
    return jsonDecode(response.body);
  }

  // تسجيل الخروج
  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('nano_token');
  }
}
