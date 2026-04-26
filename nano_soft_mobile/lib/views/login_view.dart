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
  final _identifierController = TextEditingController();
  final _passwordController = TextEditingController();
  final _authService = AuthService();
  bool _isLoading = false;
  bool _isPhone = true; // Toggle between Phone and Email

  Future<void> _handleLogin() async {
    if (_identifierController.text.isEmpty || _passwordController.text.isEmpty) return;
    
    setState(() => _isLoading = true);
    try {
      // If needed, format phone number here (e.g. '+967' + _identifierController.text)
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
                    const Text('أهلاً وسهلاً بك!', style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: Color(0xFF1E3A8A))),
                    const SizedBox(height: 8),
                    const Text('سجل دخولك للاستمتاع بتجربة سلسة وآمنة', textAlign: TextAlign.center, style: TextStyle(color: Color(0xFF64748B), fontSize: 14)),
                    const SizedBox(height: 30),

                    // Tabs
                    Container(
                      decoration: BoxDecoration(
                        color: const Color(0xFFF1F5F9),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      padding: const EdgeInsets.all(4),
                      child: Row(
                        children: [
                          Expanded(
                            child: GestureDetector(
                              onTap: () => setState(() { _isPhone = true; _identifierController.clear(); }),
                              child: Container(
                                padding: const EdgeInsets.symmetric(vertical: 12),
                                decoration: BoxDecoration(
                                  color: _isPhone ? Colors.white : Colors.transparent,
                                  borderRadius: BorderRadius.circular(8),
                                  boxShadow: _isPhone ? [const BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, 2))] : [],
                                ),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    const Text('📱 ', style: TextStyle(fontSize: 16)),
                                    Text('رقم الجوال', style: TextStyle(fontWeight: FontWeight.w600, color: _isPhone ? const Color(0xFF1E3A8A) : const Color(0xFF64748B))),
                                  ],
                                ),
                              ),
                            ),
                          ),
                          Expanded(
                            child: GestureDetector(
                              onTap: () => setState(() { _isPhone = false; _identifierController.clear(); }),
                              child: Container(
                                padding: const EdgeInsets.symmetric(vertical: 12),
                                decoration: BoxDecoration(
                                  color: !_isPhone ? Colors.white : Colors.transparent,
                                  borderRadius: BorderRadius.circular(8),
                                  boxShadow: !_isPhone ? [const BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, 2))] : [],
                                ),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    const Text('✉️ ', style: TextStyle(fontSize: 16)),
                                    Text('البريد الإلكتروني', style: TextStyle(fontWeight: FontWeight.w600, color: !_isPhone ? const Color(0xFF1E3A8A) : const Color(0xFF64748B))),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 25),

                    _isPhone 
                      ? _buildPhoneField() 
                      : _buildRoyalField(_identifierController, 'أدخل بريدك الإلكتروني', Icons.email_outlined),
                    
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

  Widget _buildPhoneField() {
    return TextField(
      controller: _identifierController, 
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
              Image.network('https://flagcdn.com/w40/ye.png', width: 24, errorBuilder: (context, error, stackTrace) => const Text('YE', style: TextStyle(fontWeight: FontWeight.bold))),
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
