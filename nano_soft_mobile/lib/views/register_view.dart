import 'dart:ui';
import 'package:flutter/material.dart';
import '../services/auth_service.dart';
import 'verify_view.dart';

class RegisterView extends StatefulWidget {
  const RegisterView({super.key});

  @override
  State<RegisterView> createState() => _RegisterViewState();
}

class _RegisterViewState extends State<RegisterView> {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _mobileController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _authService = AuthService();
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    // حذف أي توكن سابق لكي لا يرفض السيرفر طلب إنشاء الحساب (403)
    _authService.logout();
  }

  Future<void> _handleRegister() async {
    setState(() => _isLoading = true);
    try {
      await _authService.register({
        'name': _nameController.text,
        'email': _emailController.text,
        'mobile': _mobileController.text,
        'password': _passwordController.text,
        'password_confirmation': _confirmPasswordController.text,
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('تم إنشاء الحساب بنجاح!')));
        // الانتقال لصفحة التفعيل
        Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => const VerifyView()));
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.toString())));
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(backgroundColor: Colors.transparent, elevation: 0, iconTheme: const IconThemeData(color: Color(0xFF1E3A8A))),
      body: Stack(
        children: [
          Container(color: const Color(0xFFFAFAFA)),
          Positioned(top: -100, right: -100, child: _buildGlowSphere(const Color(0xFF1E3A8A).withOpacity(0.15), 300)),
          Positioned(bottom: -100, left: -100, child: _buildGlowSphere(const Color(0xFFD4AF37).withOpacity(0.2), 300)),

          Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 20),
              child: Container(
                constraints: const BoxConstraints(maxWidth: 400),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.95),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: const Color(0xFFD4AF37).withOpacity(0.3)),
                  boxShadow: [BoxShadow(color: const Color(0xFF1E3A8A).withOpacity(0.08), blurRadius: 40, offset: const Offset(0, 20))],
                ),
                padding: const EdgeInsets.all(40),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text('إنشاء حساب', style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: Color(0xFF1E3A8A))),
                    const SizedBox(height: 40),
                    _buildRoyalField(_nameController, 'الاسم الكامل', Icons.person_outline),
                    const SizedBox(height: 16),
                    _buildRoyalField(_emailController, 'البريد الإلكتروني', Icons.email_outlined),
                    const SizedBox(height: 16),
                    _buildPhoneField(),
                    const SizedBox(height: 16),
                    _buildRoyalField(_passwordController, 'كلمة المرور', Icons.lock_outline, isPass: true),
                    const SizedBox(height: 16),
                    _buildRoyalField(_confirmPasswordController, 'تأكيد كلمة المرور', Icons.lock_reset, isPass: true),
                    const SizedBox(height: 32),
                    _buildRoyalButton('إنشاء حساب'),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGlowSphere(Color color, double size) {
    return Container(width: size, height: size, decoration: BoxDecoration(shape: BoxShape.circle, color: color), child: BackdropFilter(filter: ImageFilter.blur(sigmaX: 60, sigmaY: 60), child: Container(color: Colors.transparent)));
  }

  Widget _buildPhoneField() {
    return TextField(
      controller: _mobileController, 
      keyboardType: TextInputType.phone,
      style: const TextStyle(fontSize: 15, color: Color(0xFF1E3A8A)),
      decoration: InputDecoration(
        labelText: 'رقم الجوال', 
        labelStyle: const TextStyle(color: Color(0xFF64748B), fontSize: 14),
        prefixIcon: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          margin: const EdgeInsets.only(left: 12),
          decoration: const BoxDecoration(
            border: Border(left: BorderSide(color: Color(0xFFE2E8F0))),
          ),
          child: const Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text('🇾🇪', style: TextStyle(fontSize: 18)),
              SizedBox(width: 4),
              Text('+967', style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF1E3A8A), fontSize: 15)),
            ],
          ),
        ),
        filled: true, 
        fillColor: Colors.white, 
        contentPadding: const EdgeInsets.symmetric(vertical: 16, horizontal: 20),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFD4AF37), width: 2)),
      ),
    );
  }

  Widget _buildRoyalField(TextEditingController controller, String label, IconData icon, {bool isPass = false}) {
    return TextField(
      controller: controller, obscureText: isPass, style: const TextStyle(fontSize: 15, color: Color(0xFF1E3A8A)),
      decoration: InputDecoration(
        labelText: label, labelStyle: const TextStyle(color: Color(0xFF64748B), fontSize: 14), prefixIcon: Icon(icon, size: 22, color: const Color(0xFF1E3A8A)), filled: true, fillColor: Colors.white, contentPadding: const EdgeInsets.symmetric(vertical: 16, horizontal: 20),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFD4AF37), width: 2)),
      ),
    );
  }

  Widget _buildRoyalButton(String text) {
    return Container(
      width: double.infinity, height: 56,
      decoration: BoxDecoration(color: const Color(0xFF1E3A8A), borderRadius: BorderRadius.circular(12), boxShadow: [BoxShadow(color: const Color(0xFF1E3A8A).withOpacity(0.25), blurRadius: 15, offset: const Offset(0, 8))]),
      child: ElevatedButton(
        onPressed: _isLoading ? null : _handleRegister, // ربطنا الدالة
        style: ElevatedButton.styleFrom(backgroundColor: Colors.transparent, shadowColor: Colors.transparent, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
        child: _isLoading ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: Color(0xFFF9D976), strokeWidth: 2.5)) : Text(text, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFFF9D976))),
      ),
    );
  }
}
