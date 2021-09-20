---
"dark-theme-utils": patch
---

Remove postinstall script husky as it is not intended to run when end-users install dark-theme-utils. Make it a prepare script instead with npx.
