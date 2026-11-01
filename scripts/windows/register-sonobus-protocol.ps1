# Registers the sonobus:// protocol for the CURRENT USER only (HKCU), so the
# "Join Jam" button in MusicBond opens SonoBus.
# Usage:  powershell -File register-sonobus-protocol.ps1 -ExePath "C:\path\SonoBus.exe"
# Undo:   powershell -File register-sonobus-protocol.ps1 -Remove
param(
  [string]$ExePath,
  [switch]$Remove
)

$key = 'HKCU:\Software\Classes\sonobus'

if ($Remove) {
  if (Test-Path $key) { Remove-Item $key -Recurse -Force; 'Removed sonobus:// registration.' }
  else { 'Nothing to remove.' }
  return
}

if (-not $ExePath -or -not (Test-Path $ExePath)) { throw 'Pass a valid -ExePath to SonoBus.exe' }
$ExePath = (Resolve-Path $ExePath).Path

New-Item -Path "$key\shell\open\command" -Force | Out-Null
Set-ItemProperty -Path $key -Name '(default)' -Value 'URL:sonobus Protocol'
Set-ItemProperty -Path $key -Name 'URL Protocol' -Value ''
Set-ItemProperty -Path "$key\shell\open\command" -Name '(default)' -Value ('"{0}" "%1"' -f $ExePath)
"Registered: sonobus:// -> $ExePath"
