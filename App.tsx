import React, { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";

type Language = "te-IN" | "en-IN";

export default function App() {
  const [language, setLanguage] = useState<Language>("te-IN");
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useSpeechRecognitionEvent("start", () => setIsListening(true));
  useSpeechRecognitionEvent("end", () => setIsListening(false));
  useSpeechRecognitionEvent("result", (event) => {
    const spokenText = event.results?.[0]?.transcript ?? "";
    if (spokenText) setTranscript(spokenText);
  });
  useSpeechRecognitionEvent("error", (event) => {
    setIsListening(false);
    Alert.alert(
      language === "te-IN" ? "వాయిస్ గుర్తించలేకపోయాం" : "Could not hear you",
      event.message || (language === "te-IN"
        ? "మళ్లీ ప్రయత్నించండి."
        : "Please try again.")
    );
  });

  useEffect(() => {
    if (!transcript.trim()) return;
    // Keep the spoken words visible; the user can edit the fields before continuing.
  }, [transcript]);

  const isTelugu = language === "te-IN";

  const startListening = async () => {
    try {
      const permission = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          isTelugu ? "మైక్రోఫోన్ అనుమతి కావాలి" : "Microphone permission needed",
          isTelugu
            ? "ఫోన్ సెట్టింగ్స్‌లో మైక్రోఫోన్ అనుమతిని ఇవ్వండి."
            : "Allow microphone access in your phone settings."
        );
        return;
      }
      setTranscript("");
      ExpoSpeechRecognitionModule.start({
        lang: language,
        interimResults: true,
        continuous: false,
      });
    } catch {
      Alert.alert(
        isTelugu ? "వాయిస్ ప్రారంభం కాలేదు" : "Voice input unavailable",
        isTelugu
          ? "ఈ ఫీచర్ కోసం Expo development build అవసరం. READMEలోని సూచనలు చూడండి."
          : "A native Expo development build is required. See the README for setup."
      );
    }
  };

  const stopListening = () => {
    ExpoSpeechRecognitionModule.stop();
    setIsListening(false);
  };

  const applyTranscript = () => {
    const text = transcript.trim();
    if (!text) return;

    // Recognize common Telugu, transliterated Telugu, and English route phrases.
    const routeMatch = text.match(/^(.*?)\s*(?:నుంచి|నుండి|nunchi|nundi|from)\s+(.*?)$/i);
    if (routeMatch) {
      const origin = routeMatch[1].trim().replace(/^(నేను|we|i)\s+/i, "");
      const destination = routeMatch[2]
        .trim()
        .replace(/\s*(?:వెళ్లాలి|వెళ్ళాలి|వెళ్ళాలనుకుంటున్నాను|vellali|vellanu|కి వెళ్లాలి|కి వెళ్ళాలి|please|ఉండాలి)\s*$/i, "")
        .replace(/^to\s+/i, "")
        .trim();

      if (origin && destination) {
        setFrom(origin);
        setTo(destination);
        setTranscript("");
        return;
      }
    }

    // If the phrase doesn't contain both places, use it for the next empty field.
    if (!from.trim()) {
      setFrom(text);
    } else if (!to.trim()) {
      setTo(text);
    } else {
      Alert.alert(
        isTelugu ? "ప్రదేశాలు ఇప్పటికే ఉన్నాయి" : "Places already entered",
        isTelugu ? "కొత్త వాక్యాన్ని ఉపయోగించే ముందు ప్రదేశాలను ఖాళీ చేయండి." : "Clear the route fields before applying another phrase."
      );
      return;
    }
    setTranscript("");
  };

  const clearRoute = () => {
    setFrom("");
    setTo("");
    setTranscript("");
  };

  const openRouteInMaps = async () => {
    const origin = from.trim();
    const destination = to.trim();

    if (!origin || !destination) return;

    // Google Maps handles place lookup and live route options without an API key.
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;

    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert(
        isTelugu ? "మ్యాప్స్ తెరవలేకపోయాం" : "Could not open Maps",
        isTelugu
          ? "బ్రౌజర్ లేదా Google Maps అందుబాటులో ఉందో చూసి మళ్లీ ప్రయత్నించండి."
          : "Check that a browser or Google Maps is available, then try again."
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5FAF7" />
      <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.brand}>
            <View style={styles.logo}><Text style={styles.logoText}>↗</Text></View>
            <View>
              <Text style={styles.brandName}>సులభ ప్రయాణం</Text>
              <Text style={styles.brandEnglish}>VOICE TRAVEL ASSISTANT</Text>
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Change language"
            style={styles.languageToggle}
            onPress={() => setLanguage((current) => current === "te-IN" ? "en-IN" : "te-IN")}
          >
            <Text style={styles.languageText}>{isTelugu ? "తెలుగు" : "English"}⌄</Text>
          </Pressable>
        </View>

        <View style={styles.hero}>
          <View style={styles.eyebrow}><View style={styles.liveDot} /><Text style={styles.eyebrowText}>{isTelugu ? "మీ ప్రయాణానికి తోడు" : "YOUR TRAVEL COMPANION"}</Text></View>
          <Text style={styles.title}>{isTelugu ? "ఎక్కడికి వెళ్లాలి?" : "Where do you want to go?"}</Text>
          <Text style={styles.subtitle}>
            {isTelugu
              ? "మీరు వెళ్లాలనుకున్న చోటు చెప్పండి. దారి కనుక్కోవడంలో సహాయం చేస్తాం."
              : "Tell us where you want to go. We’ll help you plan the way."}
          </Text>
        </View>

        <View style={styles.routeCard}>
          <View style={styles.routeRow}>
            <View style={styles.routeIconColumn}>
              <View style={styles.originDot} />
              <View style={styles.routeDashes}><Text style={styles.routeDash}>┆</Text></View>
            </View>
            <View style={styles.routeInputWrap}>
              <Text style={styles.fieldLabel}>{isTelugu ? "ఎక్కడి నుంచి?" : "FROM"}</Text>
              <TextInput
                value={from}
                onChangeText={setFrom}
                placeholder={isTelugu ? "ప్రస్తుత ప్రదేశం" : "Your starting point"}
                placeholderTextColor="#9AA8A1"
                style={styles.input}
                returnKeyType="next"
              />
            </View>
          </View>
          <View style={styles.routeDivider} />
          <View style={styles.routeRow}>
            <View style={styles.routeIconColumn}><View style={styles.destinationPin}><View style={styles.destinationPinInner} /></View></View>
            <View style={styles.routeInputWrap}>
              <Text style={styles.fieldLabel}>{isTelugu ? "ఎక్కడికి?" : "TO"}</Text>
              <TextInput
                value={to}
                onChangeText={setTo}
                placeholder={isTelugu ? "మీ గమ్యస్థానం" : "Your destination"}
                placeholderTextColor="#9AA8A1"
                style={styles.input}
                returnKeyType="done"
              />
            </View>
          </View>
        </View>

        <View style={styles.voiceSection}>
          <Text style={styles.voiceHeading}>{isTelugu ? "లేదా మాట్లాడండి" : "OR JUST SPEAK"}</Text>
          <Pressable
            onPress={isListening ? stopListening : startListening}
            accessibilityRole="button"
            accessibilityLabel={isListening ? "Stop listening" : "Start voice input"}
            style={({ pressed }) => [
              styles.micButton,
              isListening && styles.micButtonActive,
              pressed && styles.micButtonPressed,
            ]}
          >
            <View style={styles.micInner}>
              <Text style={styles.micGlyph}>{isListening ? "■" : "🎙"}</Text>
            </View>
          </Pressable>
          <Text style={styles.micLabel}>
            {isListening
              ? (isTelugu ? "వింటున్నాం… ఆపడానికి నొక్కండి" : "Listening… tap to stop")
              : (isTelugu ? "మాట్లాడటానికి నొక్కండి" : "Tap to speak")}
          </Text>
          <Text style={styles.voiceHint}>
            {isTelugu ? "ఉదా: ధోన్ నుంచి హైదరాబాద్ వెళ్లాలి" : "Example: I want to go from Dhone to Hyderabad"}
          </Text>
        </View>

        {!!transcript && (
          <View style={styles.transcriptCard}>
            <Text style={styles.transcriptLabel}>{isTelugu ? "మీరు చెప్పింది" : "I HEARD"}</Text>
            <Text style={styles.transcriptText}>{transcript}</Text>
            <Pressable style={styles.useTranscriptButton} onPress={applyTranscript}>
              <Text style={styles.useTranscriptText}>{isTelugu ? "ప్రదేశంగా ఉపయోగించు" : "Use this text"}  →</Text>
            </Pressable>
          </View>
        )}

        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [styles.findButton, pressed && styles.findButtonPressed]}
          onPress={() => {
            if (!from.trim() || !to.trim()) {
              Alert.alert(
                isTelugu ? "రెండు ప్రదేశాలు నమోదు చేయండి" : "Add both places",
                isTelugu ? "ఎక్కడి నుంచి, ఎక్కడికి వెళ్లాలో నమోదు చేయండి లేదా మాట్లాడండి." : "Enter or speak your starting point and destination."
              );
              return;
            }
            void openRouteInMaps();
          }}
        >
          <Text style={styles.findButtonText}>{isTelugu ? "నా దారి కనుక్కోండి" : "Find my route"}  →</Text>
        </Pressable>

        <View style={styles.footer}>
          <Text style={styles.footerLeaf}>♧</Text>
          <Text style={styles.footerText}>{isTelugu ? "సులభంగా ప్రయాణించండి. భూమిని ప్రేమించండి." : "Travel simply. Care for our planet."}</Text>
        </View>
        {(from || to || transcript) ? (
          <Pressable onPress={clearRoute} style={styles.resetButton}><Text style={styles.resetText}>{isTelugu ? "మళ్లీ మొదలుపెట్టు" : "Start over"}</Text></Pressable>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F5FAF7" },
  page: { paddingHorizontal: 22, paddingTop: 12, paddingBottom: 28 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  brand: { flexDirection: "row", alignItems: "center", gap: 10 },
  logo: { width: 42, height: 42, borderRadius: 15, backgroundColor: "#176B50", alignItems: "center", justifyContent: "center" },
  logoText: { color: "#FFFFFF", fontSize: 27, fontWeight: "800", marginTop: -2 },
  brandName: { color: "#183C30", fontSize: 17, fontWeight: "800" },
  brandEnglish: { color: "#82958C", fontSize: 8, fontWeight: "700", letterSpacing: 1.1, marginTop: 3 },
  languageToggle: { borderWidth: 1, borderColor: "#DCE8E1", backgroundColor: "#FFFFFF", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 9 },
  languageText: { color: "#275B47", fontSize: 12, fontWeight: "700" },
  hero: { marginTop: 32, marginBottom: 24 },
  eyebrow: { flexDirection: "row", alignItems: "center", gap: 7, marginBottom: 12 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#51A77B" },
  eyebrowText: { color: "#438365", fontSize: 10, fontWeight: "800", letterSpacing: 1.2 },
  title: { color: "#173B2E", fontSize: 30, fontWeight: "800", lineHeight: 39 },
  subtitle: { color: "#74877D", fontSize: 14, lineHeight: 22, marginTop: 9, maxWidth: 320 },
  routeCard: { backgroundColor: "#FFFFFF", borderRadius: 22, paddingHorizontal: 17, paddingVertical: 8, borderWidth: 1, borderColor: "#E6EEE9", shadowColor: "#193D2E", shadowOpacity: 0.04, shadowRadius: 14, shadowOffset: { width: 0, height: 5 }, elevation: 2 },
  routeRow: { flexDirection: "row", alignItems: "center", minHeight: 76 },
  routeIconColumn: { width: 28, alignItems: "center", alignSelf: "stretch", justifyContent: "center" },
  originDot: { width: 11, height: 11, borderRadius: 6, backgroundColor: "#FFFFFF", borderWidth: 3, borderColor: "#2D9B6E" },
  routeDashes: { position: "absolute", top: 42, height: 28 },
  routeDash: { color: "#B9CFC3", fontSize: 20, lineHeight: 25 },
  destinationPin: { width: 15, height: 15, borderRadius: 8, backgroundColor: "#E2F3E9", alignItems: "center", justifyContent: "center" },
  destinationPinInner: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#176B50" },
  routeInputWrap: { flex: 1, paddingLeft: 10 },
  fieldLabel: { color: "#8A9B92", fontSize: 9, fontWeight: "800", letterSpacing: 1.4, marginBottom: 4 },
  input: { color: "#203D31", fontSize: 15, paddingVertical: 3 },
  routeDivider: { height: 1, backgroundColor: "#EDF2EE", marginLeft: 38 },
  voiceSection: { alignItems: "center", marginTop: 28 },
  voiceHeading: { color: "#8A9C92", fontSize: 10, fontWeight: "800", letterSpacing: 1.8, marginBottom: 17 },
  micButton: { width: 94, height: 94, borderRadius: 47, backgroundColor: "#DCEFE4", alignItems: "center", justifyContent: "center" },
  micButtonActive: { backgroundColor: "#F7DCD7" },
  micButtonPressed: { transform: [{ scale: 0.96 }] },
  micInner: { width: 70, height: 70, borderRadius: 35, backgroundColor: "#176B50", alignItems: "center", justifyContent: "center", shadowColor: "#176B50", shadowOpacity: 0.22, shadowRadius: 9, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  micGlyph: { color: "#FFFFFF", fontSize: 27, fontWeight: "700" },
  micLabel: { color: "#214A39", fontSize: 14, fontWeight: "800", marginTop: 13 },
  voiceHint: { color: "#8A9B92", fontSize: 11, textAlign: "center", marginTop: 7, lineHeight: 17 },
  transcriptCard: { marginTop: 20, padding: 16, borderRadius: 18, backgroundColor: "#EAF5EE", borderWidth: 1, borderColor: "#D7EADF" },
  transcriptLabel: { color: "#6E8D7B", fontSize: 9, fontWeight: "800", letterSpacing: 1.3, marginBottom: 8 },
  transcriptText: { color: "#214A39", fontSize: 16, lineHeight: 23, fontWeight: "600" },
  useTranscriptButton: { alignSelf: "flex-start", marginTop: 12, paddingVertical: 8 },
  useTranscriptText: { color: "#176B50", fontWeight: "800", fontSize: 12 },
  findButton: { backgroundColor: "#176B50", borderRadius: 16, minHeight: 56, alignItems: "center", justifyContent: "center", marginTop: 24, shadowColor: "#176B50", shadowOpacity: 0.16, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 3 },
  findButtonPressed: { backgroundColor: "#12563F", transform: [{ scale: 0.99 }] },
  findButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, marginTop: 24 },
  footerLeaf: { color: "#438365", fontSize: 18 },
  footerText: { color: "#8A9B92", fontSize: 10 },
  resetButton: { alignSelf: "center", marginTop: 14, padding: 8 },
  resetText: { color: "#789086", fontSize: 11, fontWeight: "700" }
});