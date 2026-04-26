import 'dart:ui';
import 'package:flutter/material.dart';
import '../services/auth_service.dart';
import 'verify_view.dart';

class ForgotPasswordView extends StatefulWidget {
  const ForgotPasswordView({super.key});

  @override
  State<ForgotPasswordView> createState() => _ForgotPasswordViewState();
}

class _ForgotPasswordViewState extends State<ForgotPasswordView> {
  final _mobileController = TextEditingController();
  final _authService = AuthService();
  bool _isLoading = false;

  Future<void> _handleSendCode() async {
    if (_mobileController.text.isEmpty) return;
    
    setState(() => _isLoading = true);
    try {
      final res = await _authService.forgotPassword(_mobileController.text);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(res['message'] ?? 'تم إرسال الكود بنجاح')));
        // الانتقال لصفحة التحقق مع تمرير الرقم
        Navigator.push(context, MaterialPageRoute(builder: (context) => VerifyView(identifier: _mobileController.text, method: 'sms')));
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('خطأ: ${e.toString()}')));
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(backgroundColor: Colors.transparent, elevation: 0, leading: IconButton(icon: const Icon(Icons.arrow_back_ios, color: Color(0xFF1E3A8A)), onPressed: () => Navigator.pop(context))),
      body: Stack(
        children: [
          Container(color: const Color(0xFFFAFAFA)),
          Positioned(top: -100, right: -100, child: _buildGlowSphere(const Color(0xFF1E3A8A).withOpacity(0.1), 300)),

          Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 30),
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 20, offset: const Offset(0, 10))],
                ),
                padding: const EdgeInsets.all(32),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.lock_reset, size: 64, color: Color(0xFF1E3A8A)),
                    const SizedBox(height: 24),
                    const Text('استعادة كلمة المرور', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Color(0xFF1E3A8A))),
                    const SizedBox(height: 12),
                    const Text('أدخل رقم هاتفك المسجل لنرسل لك كود التحقق', textAlign: TextAlign.center, style: TextStyle(color: Color(0xFF64748B), fontSize: 14)),
                    const SizedBox(height: 32),

                    _buildRoyalField(_mobileController, 'رقم الهاتف', Icons.phone_android_outlined),
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

  Widget _buildRoyalField(TextEditingController controller, String label, IconData icon) {
    return TextField(
      controller: controller, keyboardType: TextInputType.phone,
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
        onPressed: _isLoading ? null : _handleSendCode,
        style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF1E3A8A), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
        child: _isLoading ? const CircularProgressIndicator(color: Colors.white) : const Text('إرسال الكود', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
      ),
    );
  }
}
