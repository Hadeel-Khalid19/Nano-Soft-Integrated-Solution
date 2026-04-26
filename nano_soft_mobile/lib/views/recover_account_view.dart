import 'dart:ui';
import 'package:flutter/material.dart';
import '../services/auth_service.dart';
import 'login_view.dart';

class RecoverAccountView extends StatefulWidget {
  final String mobile;
  final String code;

  const RecoverAccountView({super.key, required this.mobile, required this.code});

  @override
  State<RecoverAccountView> createState() => _RecoverAccountViewState();
}

class _RecoverAccountViewState extends State<RecoverAccountView> {
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _authService = AuthService();
  bool _isLoading = false;

  Future<void> _handleRecover() async {
    if (_passwordController.text.isEmpty) return;
    if (_passwordController.text != _confirmPasswordController.text) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('كلمات المرور غير متطابقة')));
      return;
    }

    setState(() => _isLoading = true);
    try {
      final res = await _authService.recoverAccount(widget.mobile, _passwordController.text, widget.code);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(res['message'] ?? 'تم تغيير كلمة المرور بنجاح')));
        Navigator.pushAndRemoveUntil(context, MaterialPageRoute(builder: (context) => const LoginView()), (route) => false);
      }
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('خطأ: $e')));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          Container(color: const Color(0xFFFAFAFA)),
          Positioned(bottom: -100, left: -100, child: _buildGlowSphere(const Color(0xFFD4AF37).withOpacity(0.1), 300)),

          Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 30),
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.white, borderRadius: BorderRadius.circular(24),
                  boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 20, offset: const Offset(0, 10))],
                ),
                padding: const EdgeInsets.all(32),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.vpn_key_rounded, size: 64, color: Color(0xFF1E3A8A)),
                    const SizedBox(height: 24),
                    const Text('تعيين كلمة المرور', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Color(0xFF1E3A8A))),
                    const SizedBox(height: 12),
                    const Text('قم بإدخال كلمة المرور الجديدة لحسابك', textAlign: TextAlign.center, style: TextStyle(color: Color(0xFF64748B), fontSize: 14)),
                    const SizedBox(height: 32),

                    _buildRoyalField(_passwordController, 'كلمة المرور الجديدة', Icons.lock_outline, isPass: true),
                    const SizedBox(height: 16),
                    _buildRoyalField(_confirmPasswordController, 'تأكيد كلمة المرور', Icons.lock_clock_outlined, isPass: true),
                    const SizedBox(height: 32),

                    _buildRoyalButton(),
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
    return Container(width: size, height: size, decoration: BoxDecoration(shape: BoxShape.circle, color: color), child: BackdropFilter(filter: ImageFilter.blur(sigmaX: 40, sigmaY: 40), child: Container(color: Colors.transparent)));
  }

  Widget _buildRoyalField(TextEditingController controller, String label, IconData icon, {bool isPass = false}) {
    return TextField(
      controller: controller, obscureText: isPass,
      decoration: InputDecoration(
        labelText: label, prefixIcon: Icon(icon, color: const Color(0xFF1E3A8A)), filled: true, fillColor: const Color(0xFFF8FAFC),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
      ),
    );
  }

  Widget _buildRoyalButton() {
    return SizedBox(
      width: double.infinity, height: 56,
      child: ElevatedButton(
        onPressed: _isLoading ? null : _handleRecover,
        style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF1E3A8A), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
        child: _isLoading ? const CircularProgressIndicator(color: Colors.white) : const Text('حفظ كلمة المرور', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
      ),
    );
  }
}
