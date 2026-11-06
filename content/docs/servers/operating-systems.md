---
title: Supported operating systems
description: Linux distributions Databasify can set up.
---

Database servers must run one of:

| System       | Versions     | Family |
| ------------ | ------------ | ------ |
| Ubuntu       | 24.04, 26.04 | Debian |
| Debian       | 12, 13       | Debian |
| Rocky Linux  | 9            | RHEL   |
| AlmaLinux    | 9            | RHEL   |

Databasify reads the system from `/etc/os-release` during setup and refuses anything else.

Notes:

- SELinux stays enforcing on Rocky Linux and AlmaLinux.
- Setup on the RHEL family is noticeably slower than on the Debian family.
- Only IPv4 is supported for public and private addresses.
- When ordering from a provider, the list shows the systems that provider offers. DigitalOcean has no Debian 12 image.
