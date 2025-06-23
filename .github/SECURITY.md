---
Governed by `RULES_OF_AI.md`. See repository root for supreme policy.  
Last updated: 2025-06-23 by @jamiescottcraik
---

# Security Policy for brAInwav UV Project

This document defines security requirements and best practices for the brAInwav UV Project, including all code, documentation, CI/CD, and infrastructure—especially as deployed and developed within a [devcontainer](https://containers.dev/) environment.

## 📣 Reporting Security Vulnerabilities

If you discover a security vulnerability, **do not open a public issue**.  
Instead, please report it privately by emailing **security@brainwav.ai** or by opening a [GitHub Security Advisory](https://github.com/[OWNER]/[REPO]/security/advisories/new).  
All reports will be acknowledged within 72 hours and handled according to our [Coordinated Disclosure Policy](#coordinated-disclosure-policy).

---

## 🔐 Security Principles

- **Least Privilege:** All services, containers, and users must run with the minimum privileges necessary.
- **Zero Secrets in Code:** **No secrets, API keys, or credentials** are permitted in source code, configuration files, or devcontainer images.  
  All secrets management must use the 1Password CLI (`op`).
- **Provider Neutrality:** No hardcoded provider credentials or logic in business modules—see `/.ai/RULES_OF_AI.md`.
- **Automated Scanning:** All code and containers must pass automated vulnerability, secret, and dependency scans before merge.
- **Immutable Infrastructure:** Infrastructure definitions (Dockerfiles, devcontainer.json, IaC) must be reproducible and version-controlled.

---

## 🐳 Devcontainer-specific Security

- **Image Origin:** Only use base images from trusted, verified sources (`mcr.microsoft.com/devcontainers/*`, `python:`, etc.).
- **No Privileged Containers:** `privileged: true` is prohibited in `.devcontainer/devcontainer.json` and related configs.
- **No Build-time Secrets:** Do not pass secrets via build args, ENV, or Dockerfile instructions.
- **User Context:** The default user in the devcontainer must be non-root, unless absolutely required and justified in ADR.
- **Volume Mounts:** Mount only necessary volumes; avoid mounting sensitive host directories.
- **Network Isolation:** Limit network exposure (no open ports unless required for development and documented).
- **Automated Updates:** Base images and dependencies must be updated regularly and scanned for vulnerabilities.

---

## ☁️ Dependency & Package Management

- **Approved Sources:** Only install packages from official package managers (PyPI, npm, apt, etc.)—never via curl/bash or from untrusted URLs.
- **Lockfiles:** Always use lockfiles (`requirements.txt`, `poetry.lock`, `package-lock.json`); do not bypass.
- **Vulnerability Audits:** All dependencies must pass automated vulnerability checks (e.g., `pip-audit`, `npm audit`).
- **No Outdated/Abandoned Packages:** Monitor and upgrade dependencies promptly.

---

## 🔑 Secrets Management

- **1Password CLI Only:** All secrets must be managed and accessed via the 1Password CLI (`op`).  
  Never store secrets in `.env`, source, Dockerfiles, or devcontainer configs.
- **No Logging of Secrets:** Never log, print, or output secrets to the console, logs, or error messages.
- **CI/CD Secrets:** Inject secrets into CI/CD jobs only via secure mechanisms (GitHub Actions secrets, 1Password integrations).

---

## 🔎 CI/CD Security

- **Branch Protection:** All protected branches enforce required reviews, status checks, and cannot be force-pushed.
- **Automated Scanning:** All PRs and merges trigger secret scanning, dependency audits, and container vulnerability scans.
- **No Unreviewed Code:** All code must be peer-reviewed before merge.
- **Build Isolation:** CI jobs must not share state, secrets, or artifacts between unrelated jobs.

---

## 🛡️ Runtime & Production Security

- **No Debug Mode:** Never deploy with debug/profiling tools enabled or with default credentials.
- **Environment Hardening:** Containers and VMs must disable unused services, restrict open ports, and minimize installed packages.
- **Logging:** All logs must be structured (JSON), sanitized, and not contain sensitive information.
- **Incident Response:** Security incidents are escalated per RULES_OF_AI.md §8.

---

## 👩‍💻 Developer Responsibilities

- **Stay Up To Date:** Regularly review security advisories for dependencies and tools used in the project.
- **Lock Workstations:** Never leave devcontainers or cloud shells unattended while logged in.
- **Phishing & Social Engineering:** Be vigilant for suspicious links, emails, or requests for credentials.

---

## 🤝 Coordinated Disclosure Policy

We support responsible disclosure. If you discover a vulnerability, please contact us privately as described above.  
We will investigate, respond, and coordinate a fix and public advisory where appropriate.

---

## 📚 References

- [RULES_OF_AI.md](./.ai/RULES_OF_AI.md)
- [GitHub Security Advisories](https://docs.github.com/en/code-security/security-advisories/repository-security-advisories/about-repository-security-advisories)
- [1Password CLI](https://developer.1password.com/docs/cli/)
- [Dev Container Security Best Practices](https://containers.dev/implementors/security/)
- [OWASP Docker Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html)

---

_Last updated: 2025-06-23 by @jamiescottcraik_