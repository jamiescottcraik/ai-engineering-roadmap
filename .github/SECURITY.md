# Security Policy for the brAInwav MAS Platform

This document outlines the security policy and vulnerability reporting process for all projects under the brAInwav MAS Platform umbrella. We take the security of our systems seriously and deeply appreciate the vital role that security researchers play in keeping our community safe.

## 1. Supported Versions

Security updates are applied only to the most recent versions of our software. We encourage all users to stay on the latest version of the `main` or `develop` branches.

| Version | Branch  | Supported          |
| ------- | ------- | ------------------ |
| latest  | main    | :white_check_mark: |
| next    | develop | :white_check_mark: |

## 2. Reporting a Vulnerability

> **IMPORTANT**
> Please do not report security vulnerabilities through public GitHub issues.

We ask that you report all potential vulnerabilities privately. This helps us ensure that we can validate the issue and release a patch before it is disclosed to the public, protecting all users of the platform.

### How to Report

- **Primary Method (Recommended):** Use [GitHub's private vulnerability reporting feature](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing/privately-reporting-a-security-vulnerability). This is the most secure and preferred method.
- **Secondary Method:** If you cannot use GitHub's private reporting, please email a detailed report to the project owner, Jamie Scott Craik, at the dedicated security alias: [security@brainwav.io](mailto:security@brainwav.io).

### What to Include in Your Report

To help us triage and validate your finding as quickly as possible, please include:

- Type of vulnerability (e.g., Cross-Site Scripting, Insecure Direct Object Reference, etc.).
- A detailed, step-by-step description of how to reproduce the vulnerability.
- The affected component or module (e.g., `apps/api/src/services/auth.py`).
- Proof-of-concept, exploit code, or screenshots, if available.
- Any potential impact of the vulnerability.

You can expect an initial acknowledgment of your report within 48 hours.

## 3. Security Philosophy & Scope

Our security model is built on the principles of least privilege, defense-in-depth, and our core pillar of "Ethical AI Automation."

- **Secrets Management:** All secrets and credentials are managed exclusively via 1Password CLI and are never present in source code, logs, or CI/CD environments outside of secure contexts.
- **Automated Scanning:** Our CI/CD pipelines perform automated vulnerability scanning on application dependencies and infrastructure as part of the `validate_pr.sh` quality gate.
- **AI Agent Governance:** Our AI agents operate under the strict, machine-readable policies defined in `/.ai/registry.yml`. They are considered part of our threat model. Vulnerabilities related to agent governance, prompt injection that leads to privilege escalation, or policy bypass are within scope.

### In Scope

- Vulnerabilities in the latest versions of our code on the `main` or `develop` branches.
- Vulnerabilities in our CI/CD workflows (`.github/workflows/`).
- Vulnerabilities in our core governance documents that could lead to a security bypass (`RULES_OF_AI.md`, `/.ai/registry.yml`).

### Out of Scope

- **Third-Party Dependencies:** Vulnerabilities in third-party libraries should be reported directly to the respective project maintainers. However, we welcome reports on how a known third-party vulnerability specifically impacts our application.
- **Social Engineering:** Social engineering or phishing attacks against project members.
- **Automated Scanner Noise:** Findings from automated tools that have not been manually validated to demonstrate a real-world impact.
- **Outdated Versions:** Vulnerabilities affecting unsupported or older versions of the software.

## 4. Safe Harbor

We consider security research and responsible disclosure to be a vital and legitimate activity. We will not take legal action against you for activities conducted in good faith and in accordance with this policy.

---

Thank you for helping keep the brAInwav MAS Platform secure.
