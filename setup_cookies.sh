#!/bin/bash
# setup_cookies.sh

echo "---------------------------------------------------"
echo "Imperium Bot - YouTube Cookies Setup"
echo "---------------------------------------------------"
echo "YouTube requires cookies to verify you are not a bot."
echo "1. Install 'Get cookies.txt LOCALLY' extension on Chrome/Firefox."
echo "2. Go to YouTube.com (logged in or out)."
echo "3. Export cookies."
echo "4. Open the file, select all, and copy."
echo "---------------------------------------------------"
echo "PASTE the content of your cookies.txt below."
echo "Press ENTER then CTRL+D when finished."
echo "---------------------------------------------------"

cat > cookies.txt

echo ""
echo "---------------------------------------------------"
echo "cookies.txt has been saved!"
echo "Restarting bot to apply changes..."
pm2 restart imperium
echo "Done."
