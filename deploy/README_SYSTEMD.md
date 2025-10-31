Systemd deployment instructions for Fusion Starter

Overview
- This guide installs the app as a systemd service on a Linux VPS (Ubuntu/Debian recommended).
- It assumes you will host the app at /var/www/benazir-yakta (change as needed).

Steps
1) Clone and install deps
   sudo mkdir -p /var/www/benazir-yakta
   sudo chown $USER:$USER /var/www/benazir-yakta
   git clone <your-repo-url> /var/www/benazir-yakta
   cd /var/www/benazir-yakta
   npm ci
   npm run build

2) Create env file (optional)
   sudo touch /etc/fusion-starter.env
   sudo chmod 640 /etc/fusion-starter.env
   # Add lines like:
   # PORT=3000
   # NODE_ENV=production
   # PING_MESSAGE=hello
   Edit with sudo and add any secrets.

3) Ensure upload/data dirs exist and are writable by the service user
   sudo mkdir -p /var/www/benazir-yakta/server/uploads /var/www/benazir-yakta/server/data
   sudo chown -R www-data:www-data /var/www/benazir-yakta

4) Install the systemd service
   # Copy the service file deployed in this repo to systemd
   sudo cp deploy/fusion-starter.service /etc/systemd/system/fusion-starter.service
   # Edit /etc/systemd/system/fusion-starter.service and update WorkingDirectory and ExecStart if you used a different path or user
   sudo systemctl daemon-reload
   sudo systemctl enable --now fusion-starter.service
   sudo journalctl -u fusion-starter -f

5) Optional: Use nginx as reverse proxy (recommended)
   Example server block (replace example.com):

   server {
     listen 80;
     server_name example.com www.example.com;

     location / {
       proxy_pass http://127.0.0.1:3000;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
     }

     location /uploads/ {
       alias /var/www/benazir-yakta/server/uploads/;
     }
   }

6) HTTPS with certbot
   sudo apt update && sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d example.com -d www.example.com

7) Logs & management
   # View runtime logs
   sudo journalctl -u fusion-starter -f

   # Restart
   sudo systemctl restart fusion-starter

Notes & troubleshooting
- If your Hostinger panel restricts ports or users, use the recommended user they provide or run via a permitted user.
- Make sure Node.js version on VPS matches the one used in development (Node 18+ recommended). Use nvm or apt to install.
- If you change WorkingDirectory or ExecStart, always run systemctl daemon-reload before restarting.
- Ensure server/uploads and server/data are backed up and not removed during deploys.

If you want, I can also generate an nginx conf file pre-filled with your domain and a sample systemd environment file template. Provide the domain and desired app path and the service user and I will generate them.
