import 'dart:convert';
import '../core/api_client.dart';

class UserService {
  Future<Map<String, dynamic>> getCurrentUser() async {
    final response = await ApiClient.get('/me');
    final data = jsonDecode(response.body);
    return data is Map && data.containsKey('user') ? data['user'] : (data is Map && data.containsKey('data') ? data['data'] : data);
  }

  Future<Map<String, dynamic>> updateProfile(Map<String, dynamic> data) async {
    // محاولة المسار المختصر /profile
    try {
      final response = await ApiClient.put('/profile?api_version=v2', data);
      if (response.statusCode >= 200 && response.statusCode < 300) {
        return jsonDecode(response.body);
      }
    } catch (e) {}

    // محاولة المسار /me كـ fallback
    final response = await ApiClient.post('/me', {
      ...data,
      '_method': 'PUT',
      'api_version': 'v2',
    });
    return jsonDecode(response.body);
  }
}
