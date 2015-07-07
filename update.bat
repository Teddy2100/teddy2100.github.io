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
set merge=true
echo Merging Polymer Modules
setlocal EnableDelayedExpansion
for /d %%D in (bower_components/*) do (for /r %%F in (%%D/*.html) do (if NOT "%%~nF"=="index" (
 if "%%D"=="iron-component-page" (set "merge=false")
 if "%%D"=="iron-doc-viewer" (set "merge=false" )
 if "%%D"=="hydrolysis" (set "merge=false" )
 if "%%D"=="web-animations-js" (set "merge=false" )

 if !merge!==false (echo Module: ./%%D/%%~nF.html ~ SKIPPED) else (
  echo ^<link rel='import' href='./%%D/%%~nF.html'/^> >> bower_components/polymer-full.html
  echo Module: ./%%D/%%~nF.html ~ MERGED
 )
 set "merge=true"
)))
echo Merge Finished
endlocal
echo.

echo.
echo Creating Vulcanize Files
 call vulcanize --inline-scripts --inline-css --strip-comments bower_components/polymer-full.html > bower_components/vulcanized-full.html
echo Created: vulcanized-full.html
 call vulcanize --inline-css --strip-comments bower_components/polymer-full.html > bower_components/vulcanized-min.html
echo Created: vulcanized-min.html
echo Files Vulcanized
echo.

pause