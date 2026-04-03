#!/bin/bash
set -e

# Install Python deps with uv (falls back to pip if uv not found)
if command -v uv &> /dev/null; then
  uv pip install -e .
else
  pip install -e .
fi

# Install Node deps
npm install

echo ""
echo "Setup complete. Run 'npm run dev' to start."
