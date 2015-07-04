@echo off
echo Update Module
del /f "bower_components\polymer-full.html"
del /f "bower_components\vulcanized-min.html"
del /f "bower_components\vulcanized-full.html"

echo.
echo Updating Bower Components
call bower update
echo Update Finished
echo.

echo.
echo Removing Unwanted Components
rmdir "./bower_components/iron-component-page" /s /q
rmdir "./bower_components/iron-doc-viewer" /s /q
rmdir "./bower_components/hydrolysis" /s /q
echo Removal Finished
echo.

echo.
echo Merging Polymer Files
for /d %%D in (bower_components/*) do (for /r %%F in (%%D/*.html) do (
 if NOT "%%~nF"=="index" if NOT "%%D"=="web-animations-js" if NOT "%%D"=="hydrolysis" (
  echo ^<link rel='import' href='./%%D/%%~nF.html'/^> >> bower_components/polymer-full.html
 )
))
echo Merge Finished
echo.

echo.
echo Creating Vulcanize Files
call vulcanize --inline-scripts --inline-css --strip-comments bower_components/polymer-full.html > bower_components/vulcanized-full.html
call vulcanize --inline-css --strip-comments bower_components/polymer-full.html > bower_components/vulcanized-min.html
echo Files Vulcanized
echo.
