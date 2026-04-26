import 'dart:ui';
import 'package:flutter/material.dart';
import '../services/auth_service.dart';
import 'register_view.dart';
import 'profile_view.dart';
import 'forgot_password_view.dart';
import 'verify_view.dart';

class LoginView extends StatefulWidget {
  const LoginView({super.key});

  @override
  State<LoginView> createState() => _LoginViewState();
}

class _LoginViewState extends State<LoginView> {
  final _identifierController = TextEditingController(); // تم تغيير الاسم ليكون عاماً (هاتف أو إيميل)
  final _passwordController = TextEditingController();
  final _authService = AuthService();
  bool _isLoading = false;

  Future<void> _handleLogin() async {
    if (_identifierController.text.isEmpty || _passwordController.text.isEmpty) return;
    
    setState(() => _isLoading = true);
    try {
      await _authService.login(_identifierController.text, _passwordController.text);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('تم تسجيل الدخول بنجاح')));
        Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => const ProfileView()));
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
      body: Stack(
        children: [
          Container(color: const Color(0xFFFAFAFA)),
          Positioned(top: -100, left: -100, child: _buildGlowSphere(const Color(0xFF1E3A8A).withOpacity(0.15), 300)),
          Positioned(bottom: -100, right: -100, child: _buildGlowSphere(const Color(0xFFD4AF37).withOpacity(0.2), 300)),

          Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 30),
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
                  mainAxisAlignment: MainAxisAlignment.center,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text('مرحباً بك', style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: Color(0xFF1E3A8A))),
                    const SizedBox(height: 8),
                    const Text('سجل دخولك لمتابعة تدريب نانو سوفت', textAlign: TextAlign.center, style: TextStyle(color: Color(0xFF64748B), fontSize: 14)),
                    const SizedBox(height: 40),

                    _buildRoyalField(_identifierController, 'البريد الإلكتروني أو الهاتف', Icons.person_outline),
                    const SizedBox(height: 20),
                    _buildRoyalField(_passwordController, 'كلمة المرور', Icons.lock_outline, isPass: true),
                    
                    Align(
                      alignment: Alignment.centerLeft,
                      child: TextButton(
                        onPressed: () {
                          Navigator.push(context, MaterialPageRoute(builder: (context) => const ForgotPasswordView()));
                        },
                        child: const Text('نسيت كلمة المرور؟', style: TextStyle(color: Color(0xFF64748B), fontSize: 13)),
                      ),
                    ),
                    
                    const SizedBox(height: 20),
                    _buildRoyalButton(),
                    
                    const SizedBox(height: 24),
                    TextButton(
                      onPressed: () {
                        Navigator.push(context, MaterialPageRoute(builder: (context) => const RegisterView()));
                      },
                      child: const Text('ليس لديك حساب؟ إنشاء حساب جديد', style: TextStyle(color: Color(0xFF1E3A8A), fontWeight: FontWeight.bold, fontSize: 14)),
                    ),

                    TextButton(
                      onPressed: () {
                        Navigator.push(context, MaterialPageRoute(builder: (context) => const VerifyView()));
                      },
                      child: const Text('تنشيط الحساب أو استرداده', style: TextStyle(color: Color(0xFFD4AF37), fontWeight: FontWeight.w600, fontSize: 13)),
                    ),
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

  Widget _buildRoyalButton() {
    return Container(
      width: double.infinity, height: 56,
      decoration: BoxDecoration(color: const Color(0xFF1E3A8A), borderRadius: BorderRadius.circular(12), boxShadow: [BoxShadow(color: const Color(0xFF1E3A8A).withOpacity(0.25), blurRadius: 15, offset: const Offset(0, 8))]),
      child: ElevatedButton(
        onPressed: _isLoading ? null : _handleLogin, 
        style: ElevatedButton.styleFrom(backgroundColor: Colors.transparent, shadowColor: Colors.transparent, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
        child: _isLoading ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: Color(0xFFF9D976), strokeWidth: 2.5)) : const Text('تسجيل الدخول', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFFF9D976))),
      ),
    );
  }
}
