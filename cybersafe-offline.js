/**
 * CyberSafe Africa — Offline Rule-Based Threat Detection Engine (v1.1)
 * Drop-in replacement for cybersafe-offline.js
 */

const CyberSafeOfflineEngine = (() => {

  // ─────────────────────────────────────────────────────────────
  // RULE DEFINITIONS
  // ─────────────────────────────────────────────────────────────

  const RULES = {

    phishing: {
      severity: "HIGH",
      label: "Phishing Attempt",
      recommendation: "Do not click links or provide personal information.",
      patterns: [
        /verify\s+your\s+(account|identity|details)/i,
        /click\s+here\s+to\s+(claim|verify|confirm|unlock)/i,
        /your\s+account\s+(has been|will be)\s+(suspended|locked|disabled|terminated)/i,
        /confirm\s+your\s+(password|pin|banking\s+details|personal\s+information)/i,
        /urgent(ly)?\s*(action|required|response|update)/i,
        /login\s+immediately|log\s+in\s+now\s+to\s+avoid/i,
        /you\s+have\s+(won|been\s+selected|qualified)\s+for\s+a?\s*(prize|reward|gift|grant)/i,
        /congratulations[!,.]?\s+you('ve|\s+have)\s+(won|been\s+selected)/i,
      ]
    },

    suspiciousLinks: {
      severity: "HIGH",
      label: "Suspicious Link",
      recommendation: "Avoid opening shortened or suspicious-looking links.",
      patterns: [
        /https?:\/\/\d{1,3}(\.\d{1,3}){3}/i,
        /bit\.ly|tinyurl|goo\.gl|t\.co|ow\.ly|rebrand\.ly|cutt\.ly/i,
        /\.xyz\/|\.top\/|\.club\/|\.tk\/|\.ml\//i,
        /(paypa1|g00gle|facebok|rsa-gov|sars-gov|nsfas-gov)\./i,
        /free\s*(download|access|account)\s*(at|@|link)/i,
        /http[^\s]+login[^\s]+verify/i,
      ]
    },

    socialEngineering: {
      severity: "MEDIUM",
      label: "Social Engineering",
      recommendation: "Verify requests independently before sending money or information.",
      patterns: [
        /send\s+(me\s+)?(money|airtime|voucher|r\d+|rand)/i,
        /i('m| am)\s+stuck\s+(in|at|abroad)/i,
        /lend\s+me|loan\s+me|borrow\s+me/i,
        /don'?t\s+tell\s+anyone|keep\s+this\s+(secret|between\s+us)/i,
        /my\s+phone\s+(was\s+stolen|is\s+broken|got\s+lost)/i,
        /transfer\s+(funds|money|payment)\s+to\s+(my|this)\s+(new\s+)?(account|number)/i,
        /i\s+need\s+your\s+help\s+(urgently|immediately|right\s+now)/i,
      ]
    },

    africaSpecificScams: {
      severity: "HIGH",
      label: "Africa-Specific Scam",
      recommendation: "Verify any government, grant, banking, or telecom-related communication through official channels.",
      patterns: [
        /sassa\s+(payment|grant|r\d+|money|deposit|verification|pin)/i,
        /nsfas\s+(fund|payment|approved|r\d+|bursary|application)/i,
        /eskom\s+(voucher|rebate|credit|free\s+electricity|load\s+shedding\s+compensation)/i,
        /sars\s+(refund|tax\s+return|penalty|investigation).*(click|link|verify|account)/i,
        /mtn\s+free\s+(data|airtime|gb)/i,
        /vodacom\s+free\s+(data|airtime)/i,
        /nigerian?\s+prince/i,
        /advance\s+fee/i,
        /419\s+scam/i,
        /next\s+of\s+kin.*(million|funds|inheritance)/i,
        /lotto\s+(winner|prize|claim)\s+south\s+africa/i,
        /whatsapp\s+(gold|premium|business\s+upgrade)/i,
        /clearance\s+fee/i,
        /processing\s+fee/i,
        /release\s+funds/i,
        /cash\s+send/i,
        /ewallet\s+payment/i,
        /capitec\s+verification/i,
        /fnb\s+secure\s+message/i,
        /absa\s+account\s+update/i,
      ]
    },

    malwareIndicators: {
      severity: "HIGH",
      label: "Malware / Harmful Content",
      recommendation: "Avoid downloading or executing unknown files.",
      patterns: [
        /download\s+(and\s+)?(install|run|execute)\s+(this|the)\s+(file|app|software|apk)/i,
        /\.apk\s*(file|download|link)/i,
        /disable\s+(your\s+)?(antivirus|security|firewall)/i,
        /allow\s+(all\s+)?(permissions|access)\s+to\s+(install|run)/i,
        /crack(ed)?\s+(version|software|app)/i,
        /keygen/i,
        /serial\s+key\s+generator/i,
      ]
    },

    credentialHarvesting: {
      severity: "HIGH",
      label: "Credential Harvesting",
      recommendation: "Never share passwords, PINs, OTPs, banking details, or identity documents.",
      patterns: [
        /enter\s+your\s+(id\s+number|id\s+no|south\s+african\s+id)/i,
        /provide\s+your\s+(pin|password|otp|one[\s-]time\s+pin)/i,
        /what\s+is\s+your\s+(mother'?s?\s+maiden\s+name|first\s+pet|school\s+name)/i,
        /share\s+(your\s+)?(banking\s+details|card\s+number|cvv|expiry\s+date)/i,
        /send\s+(your\s+)?(id|passport|selfie|photo)\s+to\s+(verify|confirm)/i,
      ]
    },

    harassment: {
      severity: "MEDIUM",
      label: "Harassment / Threats",
      recommendation: "Preserve evidence and report threats to the appropriate authority.",
      patterns: [
        /i\s+will\s+(hack|expose|destroy|ruin)\s+(you|your)/i,
        /i\s+know\s+where\s+you\s+(live|work|go\s+to\s+school)/i,
        /pay\s+(or|otherwise)\s+(i|we)\s+will/i,
        /your\s+(photos|videos|files)\s+will\s+be\s+(shared|posted|leaked)/i,
      ]
    }

  };

  // ─────────────────────────────────────────────────────────────
  // SAFE DOMAINS
  // ─────────────────────────────────────────────────────────────

  const SAFE_DOMAINS = [
    "mediaon.africa",
    "google.com",
    "youtube.com",
    "wikipedia.org",
    "gov.za",
    "sassa.gov.za",
    "nsfas.org.za",
    "sars.gov.za",
    "eskom.co.za"
  ];

  // ─────────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────────

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
  }

  function extractUrls(text) {
    return text.match(/https?:\/\/[^\s]+/gi) || [];
  }

  function isSafeDomain(url) {
    try {
      const hostname = new URL(url).hostname.toLowerCase();
      return SAFE_DOMAINS.some(domain =>
        hostname === domain || hostname.endsWith("." + domain)
      );
    } catch {
      return false;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // MAIN SCAN
  // ─────────────────────────────────────────────────────────────

  function scan(text) {

    if (!text || typeof text !== "string") {
      return {
        safe: true,
        threats: [],
        score: 0,
        riskLevel: "NONE",
        confidence: 0,
        summary: "No content to scan."
      };
    }

    const threats = [];
    const urls = extractUrls(text);
    let totalScore = 0;
    let totalMatches = 0;

    const severityWeights = { HIGH: 3, MEDIUM: 2, LOW: 1 };

    for (const [ruleKey, rule] of Object.entries(RULES)) {

      const matchedPatterns = [];
      const evidence = [];

      for (const pattern of rule.patterns) {
        const matches = text.match(pattern);
        if (matches) {
          matchedPatterns.push(pattern);
          evidence.push(matches[0]);
        }
      }

      if (matchedPatterns.length > 0) {

        // For suspicious links: skip if ALL detected URLs are safe domains
        if (ruleKey === "suspiciousLinks" && urls.length > 0) {
          const suspiciousUrls = urls.filter(url => !isSafeDomain(url));
          if (suspiciousUrls.length === 0) continue;
        }

        const score = (severityWeights[rule.severity] || 1) * matchedPatterns.length;
        totalScore += score;
        totalMatches += matchedPatterns.length;

        threats.push({
          id: generateId(),
          type: ruleKey,
          label: rule.label,
          severity: rule.severity,
          matchCount: matchedPatterns.length,
          // ✅ FIX 1: confidence is now per-threat, capped at 95 (never claims 100% certainty)
          confidence: Math.min(95, 40 + matchedPatterns.length * 15),
          evidence,
          recommendation: rule.recommendation
        });
      }
    }

    const safe = threats.length === 0;

    // ✅ FIX 2: riskLevel now includes CRITICAL — forum.html blocks on !safe,
    // so CRITICAL, HIGH, and MEDIUM all get blocked. Nothing slips through.
    let riskLevel = "NONE";
    if      (totalScore >= 12) riskLevel = "CRITICAL";
    else if (totalScore >= 7)  riskLevel = "HIGH";
    else if (totalScore >= 3)  riskLevel = "MEDIUM";
    else if (totalScore > 0)   riskLevel = "LOW";

    const confidence = safe
      ? 0
      : Math.min(95, Math.round((totalMatches * 20) + (totalScore * 5)));

    return {
      safe,
      threats,
      riskLevel,
      score: totalScore,
      confidence,
      scannedAt: new Date().toISOString(),
      engine: "offline-rules-v1.1",
      urlsScanned: urls.length,
      summary: safe
        ? "No threats detected by offline engine."
        : `${threats.length} threat type(s) detected. Risk: ${riskLevel}. Confidence: ${confidence}%.`,
      recommendations: safe
        ? []
        : [...new Set(threats.map(t => t.recommendation))]
    };
  }

  // ─────────────────────────────────────────────────────────────
  // PUBLIC API
  // ─────────────────────────────────────────────────────────────

  return { scan };

})();

window.CyberSafeOfflineEngine = CyberSafeOfflineEngine;