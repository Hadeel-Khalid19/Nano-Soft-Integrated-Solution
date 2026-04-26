import 'dart:ui';
import 'package:flutter/material.dart';
import '../services/auth_service.dart';
import 'recover_account_view.dart';
import 'login_view.dart';

class VerifyView extends StatefulWidget {
  final String? identifier;
  final String? method;
  final bool isRecovery;

  const VerifyView({super.key, this.identifier, this.method, this.isRecovery = false});

  @override
  State<VerifyView> createState() => _VerifyViewState();
}

class _VerifyViewState extends State<VerifyView> {
  late String _method;
  late TextEditingController _identifierController;
  final TextEditingController _codeController = TextEditingController();
  final AuthService _authService = AuthService();
  late int _step;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _method = widget.method ?? 'email';
    _identifierController = TextEditingController(text: widget.identifier ?? '');
    _step = widget.identifier != null ? 2 : 1;
  }

  Future<void> _sendCode() async {
    if (_identifierController.text.isEmpty) return;
    setState(() => _isLoading = true);
    try {
      await _authService.sendVerification(_method, _identifierController.text);
      if (mounted) setState(() => _step = 2);
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('خطأ: $e')));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _verifyCode() async {
    if (_codeController.text.isEmpty) return;
    setState(() => _isLoading = true);
    try {
      await _authService.checkVerification(_method, _codeController.text, _identifierController.text);
      if (mounted) {
        if (widget.isRecovery) {
          Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => RecoverAccountView(mobile: _identifierController.text, code: _codeController.text)));
        } else {
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('تم التحقق بنجاح')));
          Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => const LoginView()));
        }
      }
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('الكود غير صحيح: $e')));
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
          Positioned(top: -100, left: -100, child: _buildGlowSphere(const Color(0xFF1E3A8A).withOpacity(0.15), 300)),

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
                    Icon(widget.isRecovery ? Icons.security : Icons.verified_user_rounded, size: 64, color: const Color(0xFF1E3A8A)),
                    const SizedBox(height: 24),
                    Text(_step == 1 ? 'تنشيط الحساب' : 'التحقق من الرمز', style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Color(0xFF1E3A8A))),
                    const SizedBox(height: 12),
                    Text(_step == 1 ? 'اختر الوسيلة لإرسال كود التحقق' : 'أدخل الكود المرسل إلى ${_identifierController.text}', textAlign: TextAlign.center, style: const TextStyle(color: Color(0xFF64748B), fontSize: 14)),
                    const SizedBox(height: 32),
                    
                    if (_step == 1) ...[
                      DropdownButtonFormField<String>(
                        value: _method,
                        decoration: InputDecoration(filled: true, fillColor: const Color(0xFFF8FAFC), border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none)),
                        items: const [
                          DropdownMenuItem(value: 'email', child: Text('بريد إلكتروني')),
                          DropdownMenuItem(value: 'sms', child: Text('رسالة SMS')),
                          DropdownMenuItem(value: 'whatsapp', child: Text('واتساب')),
                        ],
                        onChanged: (val) => setState(() => _method = val!),
                      ),
                      const SizedBox(height: 16),
                      _buildRoyalField(_identifierController, 'الإيميل أو الهاتف', Icons.contact_mail_outlined),
                      const SizedBox(height: 32),
                      _buildRoyalButton(_isLoading ? 'جاري الإرسال...' : 'إرسال الرمز', _sendCode),
                    ] else ...[
                      _buildRoyalField(_codeController, 'أدخل الرمز المكون من 6 أرقام', Icons.pin_outlined, isNumber: true),
                      const SizedBox(height: 32),
                      _buildRoyalButton(_isLoading ? 'جاري التحقق...' : 'تأكيد الرمز', _verifyCode),
                      TextButton(onPressed: () => setState(() => _step = 1), child: const Text('تغيير الوسيلة', style: TextStyle(color: Color(0xFF64748B)))),
                    ],
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

  Widget _buildRoyalField(TextEditingController controller, String label, IconData icon, {bool isNumber = false}) {
    return TextField(
      controller: controller, keyboardType: isNumber ? TextInputType.number : TextInputType.text,
      decoration: InputDecoration(
        labelText: label, prefixIcon: Icon(icon, color: const Color(0xFF1E3A8A)), filled: true, fillColor: const Color(0xFFF8FAFC),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
      ),
    );
  }

  Widget _buildRoyalButton(String text, VoidCallback onPressed) {
    return SizedBox(
      width: double.infinity, height: 56,
      child: ElevatedButton(
        onPressed: _isLoading ? null : onPressed,
        style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF1E3A8A), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
        child: Text(text, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
      ),
    );
  }
}
