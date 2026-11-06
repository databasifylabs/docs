---
title: Security
description: How to report a vulnerability.
---

Do not report security vulnerabilities in public issues, discussions or pull requests. Report them privately through [GitHub's vulnerability reporting](https://github.com/databasifylabs/databasify/security/advisories/new).

Security fixes go into the latest `0.x` release. The full policy, including scope, is in [SECURITY.md](https://github.com/databasifylabs/databasify/blob/0.x/SECURITY.md).

## Trust model

Databasify has one trust level: the signed-in owner can manage all servers and databases of the instance, including running commands on those servers over SSH. Protect the owner account with a strong password and two-factor authentication.

Plugins run arbitrary PHP inside the app with no signature check. Only install plugins you trust.
