:: Created by gb, please don't edit manually.
@ECHO OFF

SETLOCAL

SET "NODE_EXE=%~dp0\node.exe"
IF NOT EXIST "%NODE_EXE%" (
  SET "NODE_EXE=node"
)

SET "GB_CLI_JS=%~dp0\node_modules\gb\bin\gb-cli.js"
FOR /F "delims=" %%F IN ('CALL "%NODE_EXE%" "%GB_CLI_JS%" prefix -g') DO (
  SET "GB_PREFIX_GB_CLI_JS=%%F\node_modules\gb\bin\gb-cli.js"
)
IF EXIST "%GB_PREFIX_GB_CLI_JS%" (
  SET "GB_CLI_JS=%GB_PREFIX_GB_CLI_JS%"
)

"%NODE_EXE%" "%GB_CLI_JS%" %*