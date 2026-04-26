import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'views/login_view.dart';

void main() {
  runApp(const NanoSoftApp());
}

class NanoSoftApp extends StatelessWidget {
  const NanoSoftApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Nano Soft Royal',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.light,
        scaffoldBackgroundColor: const Color(0xFFFAFAFA),
        textTheme: GoogleFonts.cairoTextTheme(Theme.of(context).textTheme),
        primaryColor: const Color(0xFF1E3A8A), // كحلي ملكي حقيقي وواضح
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF1E3A8A),
          primary: const Color(0xFF1E3A8A), 
          secondary: const Color(0xFFD4AF37), // ذهبي متوهج
        ),
        useMaterial3: true,
      ),
      home: const LoginView(),
    );
  }
}
