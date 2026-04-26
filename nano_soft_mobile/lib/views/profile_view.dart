import 'dart:ui';
import 'package:flutter/material.dart';
import '../services/user_service.dart';

class ProfileView extends StatefulWidget {
  const ProfileView({super.key});

  @override
  State<ProfileView> createState() => _ProfileViewState();
}

class _ProfileViewState extends State<ProfileView> {
  final _userService = UserService();
  Map<String, dynamic>? _userData;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchProfile();
  }

  Future<void> _fetchProfile() async {
    setState(() => _isLoading = true);
    try {
      final data = await _userService.getCurrentUser();
      setState(() => _userData = data);
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('خطأ في جلب البيانات')));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _showEditDialog(String type) {
    final controller = TextEditingController(text: _userData?[type == 'email' ? 'email' : 'mobile']?.toString());
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(type == 'email' ? 'تعديل الإيميل' : 'تعديل الهاتف'),
        content: TextField(
          controller: controller,
          decoration: InputDecoration(labelText: type == 'email' ? 'الإيميل الجديد' : 'الهاتف الجديد'),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('إلغاء')),
          ElevatedButton(
            onPressed: () async {
              if (controller.text.isEmpty) return;
              Navigator.pop(context);
              setState(() => _isLoading = true);
              try {
                await _userService.updateProfile({type == 'email' ? 'email' : 'mobile': controller.text});
                _fetchProfile();
                if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('تم التحديث بنجاح ✅')));
              } catch (e) {
                if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('فشل التحديث')));
                setState(() => _isLoading = false);
              }
            },
            child: const Text('حفظ'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('الملف الشخصي'), backgroundColor: const Color(0xFF1E3A8A), foregroundColor: Colors.white),
      body: _isLoading 
        ? const Center(child: CircularProgressIndicator())
        : SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              children: [
                const SizedBox(height: 20),
                CircleAvatar(
                  radius: 50,
                  backgroundColor: const Color(0xFF1E3A8A),
                  child: Text(_userData?['name']?[0]?.toUpperCase() ?? 'U', style: const TextStyle(fontSize: 30, color: Colors.white)),
                ),
                const SizedBox(height: 20),
                Text(_userData?['name'] ?? 'مستخدم نانو', style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
                const SizedBox(height: 40),
                _buildInfoTile(Icons.email, 'البريد الإلكتروني', _userData?['email'] ?? 'غير متوفر', () => _showEditDialog('email')),
                _buildInfoTile(Icons.phone, 'رقم الهاتف', _userData?['mobile'] ?? 'غير متوفر', () => _showEditDialog('mobile')),
              ],
            ),
          ),
    );
  }

  Widget _buildInfoTile(IconData icon, String label, String value, VoidCallback onTap) {
    return Card(
      child: ListTile(
        leading: Icon(icon, color: const Color(0xFF1E3A8A)),
        title: Text(label, style: const TextStyle(fontSize: 12, color: Colors.grey)),
        subtitle: Text(value, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        trailing: IconButton(icon: const Icon(Icons.edit, size: 20), onPressed: onTap),
      ),
    );
  }
}
