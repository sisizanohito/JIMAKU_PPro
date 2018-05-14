@echo off
.\ZXPSignCmd.exe -selfSignedCert JP Dokoka Japan sisizanohito abc123 jimaku.p12
.\ZXPSignCmd.exe -sign "../JIMAKU_Panel" JIMAKU.zxp .\jimaku.p12 abc123