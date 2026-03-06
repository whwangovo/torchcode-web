FROM python:3.11-slim

# Install Node.js 20 for building the JupyterLab extension
RUN apt-get update && \
    apt-get install -y --no-install-recommends ca-certificates curl gnupg && \
    mkdir -p /etc/apt/keyrings && \
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
      | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg && \
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" \
      > /etc/apt/sources.list.d/nodesource.list && \
    apt-get update && \
    apt-get install -y --no-install-recommends nodejs && \
    rm -rf /var/lib/apt/lists/*

RUN useradd -m -u 1000 user

RUN pip install --no-cache-dir \
    torch --index-url https://download.pytorch.org/whl/cpu && \
    pip install --no-cache-dir \
    jupyterlab>=4.0 \
    numpy \
    hatch-jupyter-builder>=0.5

WORKDIR /app

COPY torch_judge/ ./torch_judge/
COPY setup.py ./
RUN pip install --no-cache-dir -e .

# Build the JupyterLab extension: JS first, then Python install
COPY labextension/ ./labextension/
RUN cd labextension && jlpm install && jlpm run build:prod
RUN cd labextension && pip install --no-cache-dir .

COPY templates/ ./templates/
COPY solutions/ ./solutions/
COPY entrypoint.sh ./
RUN chmod +x /app/entrypoint.sh

# JupyterLab custom settings: fonts, theme, Simple mode, disable news
COPY jupyter_config/overrides.json /tmp/overrides.json
RUN LAB_DIR=$(jupyter lab path 2>/dev/null | grep "Application" | head -1 | sed 's/.*: *//') && \
    mkdir -p "$LAB_DIR/settings" && \
    cp /tmp/overrides.json "$LAB_DIR/settings/overrides.json" && \
    echo "overrides.json → $LAB_DIR/settings/"

RUN mkdir -p /app/notebooks /app/data && \
    chown -R user:user /app

USER user

ENV PORT=7860
EXPOSE 7860

ENTRYPOINT ["/app/entrypoint.sh"]
