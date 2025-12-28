#!/bin/bash
# Script to add theme: horizon2020 to legacy issues (23-43)

set -e

ISSUES_START=23
ISSUES_END=43
THEME="horizon2020"

echo "Adding theme: $THEME to issues $ISSUES_START-$ISSUES_END..."
echo ""

for i in $(seq $ISSUES_START $ISSUES_END); do
    INDEX_FILE="content/issue-$i/__index.md"

    if [ ! -f "$INDEX_FILE" ]; then
        echo "⚠️  Issue $i: File not found, skipping"
        continue
    fi

    # Check if theme already exists
    if grep -q "^theme:" "$INDEX_FILE"; then
        EXISTING_THEME=$(grep "^theme:" "$INDEX_FILE" | awk '{print $2}')
        echo "ℹ️  Issue $i: Already has theme: $EXISTING_THEME, skipping"
        continue
    fi

    # Add theme after the opening --- line
    # Use sed to insert after the first line (which should be ---)
    sed -i '' '1a\
theme: '"$THEME"'
' "$INDEX_FILE"

    echo "✓ Issue $i: Added theme: $THEME"
done

echo ""
echo "Done! Modified $(seq $ISSUES_START $ISSUES_END | wc -l | tr -d ' ') issue files."
echo ""
echo "Please review the changes with: git diff content/"
