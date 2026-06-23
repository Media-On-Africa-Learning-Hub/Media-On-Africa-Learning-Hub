/**
 * CyberSafe Africa — Offline Rule-Based Threat Detection Engine
 * Mirrors the backend rule engine for use in the browser with no internet.
 * Drop this file into your project root alongside cybersafe-integration.js
 */

const CyberSafeOfflineEngine = (() => {

  // ─── RULE DEFINITIONS ───────────────────────────────────────────────────────

  const RULES = {

    phishing: {
      severity: "HIGH",
      label: "Phishing Attempt",
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
      patterns: [
        /https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/i,           // raw IP links
        /bit\.ly|tinyurl|goo\.gl|t\.co|ow\.ly|rebrand\.ly|cutt\.ly/i, // URL shorteners
        /\.xyz\/|\.top\/|\.club\/|\.tk\/|\.ml\//i,                    // suspicious TLDs
        /(paypa1|g00gle|facebok|rsa-gov|sars-gov|nsfas-gov)\./i,      // lookalike domains
        /free\s*(download|access|account)\s*(at|@|link)/i,
        /http[^\s]+login[^\s]+verify/i,
      ]
    },

    socialEngineering: {
      severity: "MEDIUM",
      label: "Social Engineering",
      patterns: [
        /send\s+(me\s+)?(money|airtime|voucher|r\d+|rand)/i,
        /i('m| am)\s+stuck\s+(in|at|abroad)/i,
        /lend\s+me|loan\s+me|borrow\s+me/i,
        /don'?t\s+tell\s+anyone|keep\s+this\s+(secret|between\s+us)/i,
        /my\s+phone\s+(was\s+stolen|is\s+broken|got\s+lost)\s+.*(contact|number|call)/i,
        /transfer\s+(funds|money|payment)\s+to\s+(my|this)\s+(new\s+)?(account|number)/i,
        /i\s+need\s+your\s+help\s+(urgently|immediately|right\s+now)/i,
      ]
    },

    africaSpecificScams: {
      severity: "HIGH",
      label: "Africa-Specific Scam",
      patterns: [
        /sassa\s+(payment|grant|r\d+|money|deposit|verification|pin)/i,
        /nsfas\s+(fund|payment|approved|r\d+|bursary|application)/i,
        /eskom\s+(voucher|rebate|credit|free\s+electricity|load\s+shedding\s+compensation)/i,
        /sars\s+(refund|tax\s+return|penalty|investigation)\s+.*(click|link|verify|account)/i,
        /mtn\s+free\s+(data|airtime|gb)|vodacom\s+free\s+(data|airtime)/i,
        /nigerian?\s+prince|advance\s+fee/i,
        /419\s+scam|next\s+of\s+kin\s+.*(million|funds|inheritance)/i,
        /lotto\s+(winner|prize|claim)\s+south\s+africa/i,
        /whatsapp\s+(gold|premium|business\s+upgrade)/i,
      ]
    },

    malwareIndicators: {
      severity: "HIGH",
      label: "Malware / Harmful Content",
      patterns: [
        /download\s+(and\s+)?(install|run|execute)\s+(this|the)\s+(file|app|software|apk)/i,
        /\.apk\s*(file|download|link)/i,
        /disable\s+(your\s+)?(antivirus|security|firewall)/i,
        /allow\s+(all\s+)?(permissions|access)\s+to\s+(install|run)/i,
        /crack(ed)?\s+(version|software|app)|keygen|serial\s+key\s+generator/i,
      ]
    },

    credentialHarvesting: {
      severity: "HIGH",
      label: "Credential Harvesting",
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
      patterns: [
        /i\s+will\s+(hack|expose|destroy|ruin)\s+(you|your)/i,
        /i\s+know\s+where\s+you\s+(live|work|go\s+to\s+school)/i,
        /pay\s+(or|otherwise)\s+(i|we)\s+will/i,
        /your\s+(photos|videos|files)\s+will\s+be\s+(shared|posted|leaked)/i,
      ]
    }
  };

  // ─── SAFE DOMAIN WHITELIST ───────────────────────────────────────────────────

  const SAFE_DOMAINS = [
    'mediaon.africa', 'google.com', 'youtube.com', 'wikipedia.org',
    'gov.za', 'sassa.gov.za', 'nsfas.org.za', 'sars.gov.za', 'eskom.co.za'
  ];

  function isSafeDomain(text) {
    return SAFE_DOMAINS.some(domain => text.includes(domain));
  }

  // ─── CORE SCAN FUNCTION ─────────────────────────────────────────────────────

  /**
   * Scans a piece of text for threats using all rule sets.
   * @param {string} text - The content to scan
   * @returns {Object} Result object with threats found
   */
  function scan(text) {
    if (!text || typeof text !== 'string') {
      return { safe: true, threats: [], score: 0, summary: 'No content to scan.' };
    }

    const threats = [];
    let highestSeverityScore = 0;

    const severityScore = { HIGH: 3, MEDIUM: 2, LOW: 1 };

    for (const [ruleKey, rule] of Object.entries(RULES)) {
      const matchedPatterns = rule.patterns.filter(pattern => pattern.test(text));

      if (matchedPatterns.length > 0) {
        // Skip if text contains safe domain and rule is suspiciousLinks
        if (ruleKey === 'suspiciousLinks' && isSafeDomain(text)) continue;

        threats.push({
          type: ruleKey,
          label: rule.label,
          severity: rule.severity,
          matchCount: matchedPatterns.length,
        });

        const score = severityScore[rule.severity] || 1;
        if (score > highestSeverityScore) highestSeverityScore = score;
      }
    }

    const safe = threats.length === 0;
    const riskLevel = highestSeverityScore >= 3 ? 'HIGH' :
                      highestSeverityScore === 2 ? 'MEDIUM' : 
                      highestSeverityScore === 1 ? 'LOW' : 'NONE';

    return {
      safe,
      threats,
      riskLevel,
      score: highestSeverityScore,
      scannedAt: new Date().toISOString(),
      engine: 'offline-rules-v1',
      summary: safe
        ? 'No threats detected by offline engine.'
        : `${threats.length} threat type(s) detected: ${threats.map(t => t.label).join(', ')}.`
    };
  }

  // ─── PUBLIC API ──────────────────────────────────────────────────────────────

  return { scan };

})();

// Make available globally
window.CyberSafeOfflineEngine = CyberSafeOfflineEngine;
