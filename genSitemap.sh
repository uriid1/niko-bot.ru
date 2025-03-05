#!/bin/bash

BASE_URL="https://niko-bot.ru"
PAGES_DIR="src/pages"
SITEMAP_FILE="sitemap.xml"

# Загаловок
echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" > $SITEMAP_FILE
echo "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">" >> $SITEMAP_FILE

# Главная страница
lastmod=$(stat -c "%Y" "index.html" | awk '{print strftime("%Y-%m-%d", $1)}')
echo "  <url>" >> $SITEMAP_FILE
echo "    <loc>$BASE_URL/</loc>" >> $SITEMAP_FILE
echo "    <lastmod>$lastmod</lastmod>" >> $SITEMAP_FILE
echo "    <changefreq>weekly</changefreq>" >> $SITEMAP_FILE
echo "    <priority>1.0</priority>" >> $SITEMAP_FILE
echo "  </url>" >> $SITEMAP_FILE

priority=0.9
processDir() {
  local dirPath="$1"
  local relativePath=${dir_path#$PAGES_DIR/}
  local url="$BASE_URL/${relativePath}/"
  local lastmod=$(stat -c "%Y" "$dirPath/index.html" | awk '{print strftime("%Y-%m-%d", $1)}')

  echo "  <url>"                             >> $SITEMAP_FILE
  echo "    <loc>$url</loc>"                 >> $SITEMAP_FILE
  echo "    <lastmod>$lastmod</lastmod>"     >> $SITEMAP_FILE
  echo "    <changefreq>weekly</changefreq>" >> $SITEMAP_FILE
  echo "    <priority>$priority</priority>"  >> $SITEMAP_FILE
  echo "  </url>"                            >> $SITEMAP_FILE

  # Дикримент приоритета
  priority=$(awk "BEGIN {print $priority - 0.1}")
}

find "$PAGES_DIR" -type f -name "index.html" | while read -r file; do
  dirPath=$(dirname "$file")
  processDir "$dirPath"
done

echo "</urlset>" >> $SITEMAP_FILE

echo "[ok]: $SITEMAP_FILE"
