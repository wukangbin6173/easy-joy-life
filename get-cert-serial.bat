@echo off
echo 查看微信支付商户证书序列号
echo ================================

echo.
echo 方法1: 使用OpenSSL查看证书序列号
echo openssl x509 -in apiclient_cert.pem -serial -noout

echo.
echo 方法2: 查看证书详细信息
echo openssl x509 -in apiclient_cert.pem -text -noout

echo.
echo 请将 apiclient_cert.pem 文件放在当前目录下，然后运行上述命令
echo.

pause