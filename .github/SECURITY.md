# Security Policy

Thank you for helping keep **advaitachandra.in** and its associated services secure. We take security vulnerabilities seriously and appreciate the efforts of security researchers and developers to responsibly disclose potential issues.

---

## Supported Versions

Only the latest deployment running on the `main` branch is actively maintained and eligible for security fixes.

| Version / Branch | Supported          | Status |
| ---------------- | ------------------ | ------ |
| `main` (Production) | :white_check_mark: | Actively monitored and maintained |
| `< 1.0.0` (Historical tags) | :x:                | Unsupported |

---

## Reporting a Vulnerability

Please **do not** report security vulnerabilities through public GitHub issues, pull requests, or public discussions.

### Preferred Method: GitHub Private Vulnerability Reporting

This repository has **Private Vulnerability Reporting** enabled. You can submit a private advisory directly through GitHub:

1. Navigate to the **[Security Advisories](https://github.com/w1tneess/advaita-website/security/advisories)** tab of this repository.
2. Click **[Report a vulnerability](https://github.com/w1tneess/advaita-website/security/advisories/new)**.
3. Fill out the report details, severity estimate, and proof of concept.
4. Submit the report. A private discussion channel will be opened with the repository maintainer.

### Alternative Method: Direct Email

If you cannot use GitHub Private Vulnerability Reporting, you may email:

- **Email**: [hi@advaitachandra.in](mailto:hi@advaitachandra.in)
- **Subject line**: `[SECURITY] Vulnerability Report - advaita-website`

---

## What to Include in Your Report

To help us triage and resolve the issue quickly, please include:

1. **Description**: A clear description of the vulnerability and its potential impact.
2. **Affected Components**: Specific URL, route, script, or API endpoint affected.
3. **Reproduction Steps**: Step-by-step instructions or minimal Proof of Concept (PoC).
4. **Environment**: Browser, OS, or specific request headers used during testing.
5. **Mitigation Suggestion**: Any proposed fix or remediation (if available).

---

## Response & Disclosure Process

- **Acknowledgment**: We aim to acknowledge receipt of your report within **48 hours**.
- **Assessment**: We will investigate the issue, determine its severity, and provide periodic status updates.
- **Remediation**: Once verified, a fix will be developed, tested, and deployed to production.
- **Coordinated Disclosure**: We adhere to coordinated vulnerability disclosure. We ask that you give us reasonable time to deploy a fix before disclosing any details publicly.

---

## Safe Harbor & Responsible Research

If you conduct security research in good faith:

- We will not pursue legal action against you.
- We request that you avoid data destruction, privacy violations (e.g. accessing other users' personal data), and service disruption (such as volumetric DDoS or denial of service).
- If you find sensitive credentials or personal data, stop testing immediately and notify us.
