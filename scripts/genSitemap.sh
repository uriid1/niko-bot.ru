#!/bin/bash

BASE_URL="https://niko-bot.ru"
PAGES_DIR="site/pages"
SITEMAP_FILE="site/sitemap.xml"

# Список разрешённых страниц (без "index.html")
ALLOWED_PAGES=(
  "commands-guide"
  "mod-commands-guide"
)

# Заголовок
echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" > $SITEMAP_FILE
echo "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">" >> $SITEMAP_FILE

# Главная страница
if [[ -f "site/index.html" ]]; then
  lastmod=$(stat -c "%Y" "site/index.html" | awk '{print strftime("%Y-%m-%d", $1)}')
  echo "  <url>"                             >> $SITEMAP_FILE
  echo "    <loc>$BASE_URL/</loc>"           >> $SITEMAP_FILE
  echo "    <lastmod>$lastmod</lastmod>"     >> $SITEMAP_FILE
  echo "    <changefreq>weekly</changefreq>" >> $SITEMAP_FILE
  echo "    <priority>1.0</priority>"        >> $SITEMAP_FILE
  echo "  </url>"                            >> $SITEMAP_FILE
fi

priority=0.9
for page in "${ALLOWED_PAGES[@]}"; do
  dirPath="$PAGES_DIR/$page"
  indexFile="$dirPath/index.html"

  if [[ -f "$indexFile" ]]; then
    lastmod=$(stat -c "%Y" "$indexFile" | awk '{print strftime("%Y-%m-%d", $1)}')
    echo "  <url>"                             >> $SITEMAP_FILE
    echo "    <loc>$BASE_URL/$page/</loc>"     >> $SITEMAP_FILE
    echo "    <lastmod>$lastmod</lastmod>"     >> $SITEMAP_FILE
    echo "    <changefreq>weekly</changefreq>" >> $SITEMAP_FILE
    echo "    <priority>$priority</priority>"  >> $SITEMAP_FILE
    echo "  </url>"                            >> $SITEMAP_FILE

    # Уменьшаем приоритет, но не ниже 0.1
    priority=$(awk "BEGIN {print ($priority - 0.1 < 0.1) ? 0.1 : $priority - 0.1}")
  fi
done

echo "</urlset>" >> $SITEMAP_FILE

echo "[ok] $SITEMAP_FILE"
