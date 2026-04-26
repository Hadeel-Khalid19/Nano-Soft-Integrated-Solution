import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiClient {
  static const String baseUrl = 'https://account.now-ye.com/api/v1';

  static Future<http.Response> get(String endpoint) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('nano_token');

    return await http.get(
      Uri.parse('$baseUrl$endpoint'),
      headers: {
        'Accept': 'application/json',
        'api-version': 'v2',
        'Authorization': token != null ? 'Bearer $token' : '',
      },
    );
  }

  static Future<http.Response> post(String endpoint, Map<String, dynamic> body) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('nano_token');

    return await http.post(
      Uri.parse('$baseUrl$endpoint'),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-version': 'v2',
        'Authorization': token != null ? 'Bearer $token' : '',
      },
      body: jsonEncode(body),
    );
  }

  static Future<http.Response> put(String endpoint, Map<String, dynamic> body) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('nano_token');

    return await http.put(
      Uri.parse('$baseUrl$endpoint'),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-version': 'v2',
        'Authorization': token != null ? 'Bearer $token' : '',
      },
      body: jsonEncode(body),
    );
  }
}
