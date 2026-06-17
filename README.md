# LE Consulting - Offline CRM Portal (Lokale Einrichtung)

Dieses Portal ist so konzipiert, dass es vollständig auf Ihrem eigenen Computer läuft. Da alle Berechnungen und Datenverläufe lokal in Ihrem Webbrowser (über den sogenannten `localStorage`) verschlüsselt gespeichert werden, wird keine fremde Cloud oder Datenbank benötigt.

Hier ist die einfache Schritt-für-Schritt-Anleitung, um die Anwendung lokal zu starten:

---

## 🚀 Schnellstart-Anleitung

Der Fehler `"Der Befehl 'vite' konnte nicht gefunden werden"` tritt auf, wenn die Projekt-Pakete noch nicht auf Ihren Computer heruntergeladen wurden. Mit folgenden Schritten beheben Sie das in einer Minute:

### 1. Projekt-Verzeichnis im Terminal öffnen
Öffnen Sie Ihre Eingabeaufforderung (CMD), Anaconda Prompt oder PowerShell und wechseln Sie in Ihr Projektverzeichnis (wo diese `package.json`-Datei liegt):
```bash
cd K:\python\scripte\crm\web
```

### 2. Module installieren (Zwingend notwendig!)
Führen Sie folgenden Befehl aus, um alle benötigten Werkzeuge (inklusive `vite`) automatisch zu installieren. **Dies lädt alle Abhängigkeiten sicher auf Ihren PC herunter:**
```bash
npm install
```
*(Hinweis: Dieser Befehl muss nur **ein einziges Mal** bei der ersten Einrichtung ausgeführt werden.)*

### 3. Entwickler-Server starten
Nachdem die Installation abgeschlossen ist, starten Sie das Portal mit:
```bash
npm run dev
```

### 4. Im Browser öffnen
In Ihrer Konsole erscheint nun eine Adresse. Öffnen Sie einfach Ihren gewohnten Webbrowser (Chrome, Firefox, Edge, Safari etc.) und rufen Sie folgende Seite auf:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🔑 Demo-Zugangsdaten (Offline-Testen)

Sobald das Portal im Webbrowser geöffnet ist, können Sie sich mit folgenden Testdaten anmelden:

* **Administrator (Leitung/CRM):**
  * **Benutzername:** `admin`
  * **Passwort:** `admin123`
  
* **Kunde (Max Mustermann - vordefiniert):**
  * **Benutzername:** `max.muster`
  * **Passwort:** `kunde123`

### 💡 Wichtiger Hinweis zu neu angelegten Benutzern:
Wenn Sie als Administrator im CRM-Panel einen neuen Kunden anlegen (z.B. Name: `Max Muster`, Benutzername: `max.muster`, Passwort: `max.muster`), können Sie sich sofort mit dem neu vergebenen Passwort einloggen! Der vorherige Fehler im Passwort-Hintergrundcode wurde behoben: Administrator-Erstellungen und der Login-Bildschirm nutzen nun exakt dasselbe offline-sichere Verschlüsselungsverfahren.

---

## 🖥️ Server-Installation & Deployment (via PuTTY & Linux-Server)

Dieses React-Vite-Projekt wird beim Builden zu hocheffizienten, statischen Dateien (HTML, JS, CSS in der Ordnerstruktur `dist/`) kompiliert. Hier ist der Leitfaden für die Installation auf einem eigenen Linux-Server (z. B. Ubuntu oder Debian) unter Verwendung von **PuTTY** und **Nginx / PM2**.

### 1. Verbindung herstellen mit PuTTY
1. Starten Sie **PuTTY** auf Ihrem Windows-Rechner.
2. Geben Sie im Feld **Host Name (or IP address)** die IP-Adresse Ihres Servers ein (Standard-Port `22` für SSH).
3. Klicken Sie unten auf **Open**.
4. Melden Sie sich in der Konsole an (normalerweise als `root` oder ein Benutzer mit Sudo-Rechten, zum Beispiel `ubuntu`):
   ```bash
   login as: root
   Password: [Ihr Server-Passwort]
   ```

---

### 2. System vorbereiten (Node.js & Npm installieren)
Bevor das Projekt gestartet wird, benötigt der Server Node.js. Installieren Sie die aktuelle LTS-Version über die Konsole:

```bash
# System-Paketlisten aktualisieren
sudo apt update && sudo apt upgrade -y

# NodeSource Repository für Node.js 20.x einrichten
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Node.js und Git installieren
sudo apt-get install -y nodejs git build-essential
```
*Zur Kontrolle der Installation:*
```bash
node -v # Sollte v20.x.x anzeigen
npm -v  # Sollte v10.x.x anzeigen
```

---

### 3. Projekt auf den Server übertragen
Sie können den Quellcode entweder per SFTP (z. B. mit **FileZilla** oder **WinSCP**) in das Verzeichnis `/var/www/le-consulting` hochladen, oder direkt via Git klonen:

```bash
# Verzeichnis erstellen und dorthin wechseln
sudo mkdir -p /var/www/le-consulting
sudo chown -R $USER:$USER /var/www/le-consulting
cd /var/www/le-consulting

# Projektdateien dorthin kopieren oder klonen
# (Danach sicherstellen, dass package.json in diesem Verzeichnis liegt!)
ls -la
```

---

### 4. Abhängigkeiten installieren & Kompilieren (Production Build)
Führen Sie im Projektverzeichnis auf der Server-Konsole folgende Befehle aus:

```bash
# 1. Optionale Cache-Bereinigung & Installation aller Module
npm install

# 2. Generierung der produktionsfertigen Webdateien
npm run build
```
Nach erfolgreichem Durchlauf von `npm run build` liegt der einsatzbereite Webcode im Unterverzeichnis `/var/www/le-consulting/dist`.

---

### 5. Hosting-Optionen (Servieren der Anwendung)

Da es sich um eine modern optimierte Single-Page-Application (SPA) handelt, ist ein professioneller Webserver wie **Nginx** die performanteste und sicherste Lösung.

#### Option A: Der Standard-Weg mit Nginx (Empfohlen für Produktion)

1. **Nginx installieren:**
   ```bash
   sudo apt install nginx -y
   ```

2. **Nginx-Konfiguration für die Anwendung anlegen:**
   ```bash
   sudo nano /etc/nginx/sites-available/le-consulting
   ```

3. **Folgenden Konfigurations-Block einfügen** (ermöglicht HTTPS, korrekte Pfad-Umleitungen und Caching-Regeln):
   ```nginx
   server {
       listen 80;
       server_name crm.ihre-domain.de; # Ersetzen Sie dies durch Ihre Domain oder IP-Adresse

       root /var/www/le-consulting/dist;
       index index.html;

       # Verhindert Page-Refresh-Fehler (404 bei Unterseiten im Browser)
       location / {
           try_files $uri $uri/ /index.html;
       }

       # Caching für Bilder, Icons und Mediendateien optimieren
       location ~* \.(?:ico|css|js|gif|jpe?g|png|woff2?|eot|ttf|svg|mp4)$ {
           expires 6M;
           access_log off;
           add_header Cache-Control "public";
       }

       error_page 500 502 503 504 /50x.html;
       location = /50x.html {
           root /usr/share/nginx/html;
       }
   }
   ```
   *(Speichern mit `STRG+O`, dann `Enter` drücken und Beenden mit `STRG+X`)*

4. **Konfiguration aktivieren & Nginx neu starten:**
   ```bash
   # Link setzen, um die Website scharfzuschalten
   sudo ln -s /etc/nginx/sites-available/le-consulting /etc/nginx/sites-enabled/

   # Standard-Konfiguration entfernen, falls diese auf Port 80 stört
   sudo rm /etc/nginx/sites-enabled/default

   # Konfiguration testen
   sudo nginx -t

   # Nginx neu laden
   sudo systemctl restart nginx
   ```

---

#### Option B: Schneller Vorschau-Server im Hintergrund (via PM2)
Falls Sie die Anwendung intern ohne Nginx im Netzwerk via Node/Vite bereitstellen möchten, können Sie das Paket **PM2** als Prozess-Manager nutzen, damit die Anwendung im Hintergrund weiterläuft, selbst wenn Sie PuTTY schließen:

```bash
# PM2 global auf dem Server installieren
sudo npm install -y pm2 -g

# Vorschau-Server im Hintergrund starten (Port 3000)
pm2 start "npm run preview -- --port 3000 --host 0.0.0.0" --name "le-consulting-preview"

# Sicherstellen, dass die App bei Server-Neustarts automatisch bootet
pm2 save
pm2 startup
```

---

### 6. SSL-Sicherheitszertifikat (HTTPS) einrichten (Empfohlen)
Um die sensiblen Mandantendaten zu schützen, sollten Sie die Verbindung zwingend über HTTPS verschlüsseln. Mit **Let's Encrypt** (kostenlos) ist das in wenigen Schritten erledigt:

```bash
# Certbot für Nginx installieren
sudo apt install certbot python3-certbot-nginx -y

# SSL-Zertifikat automatisch anfordern und einrichten lassen
sudo certbot --nginx -d crm.ihre-domain.de

# (Den Anweisungen folgen und den Redirect auf HTTPS aktivieren lassen)
```
Das Zertifikat erneuert sich von jetzt an völlig automatisch im Hintergrund!

