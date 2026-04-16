# lirc‑web‑remote

Written by **Jeff Sadowski**  
*Free and open source under the Apache 2.0 license.*  
I give no warranty of any kind.

This project is a web‑based remote interface for LIRC.  
It’s already more capable than any LIRC interface I’ve seen, and I’m actively improving it.

---

## Requirements

### LIRC
- Install `lircd`
- Add your LIRC remote configuration files
- Ensure your remotes use proper button names  
  (`irrecord -l` shows valid names — many downloaded configs use invalid ones)

### irsend service
This project requires **netcat (nc)** for the custom `irsend_mult` service.

---

## Install the irsend service

```bash
adduser irsend
adduser irsend lirc

sudo cp irsend_mult.service /etc/systemd/system/irsend_mult.service
sudo systemctl daemon-reload
sudo systemctl start irsend_mult
sudo systemctl enable irsend_mult

sudo chown -R irsend: /var/www/html/lirc-web-remote/data/
/var/www/html/lirc-web-remote/refresh_remotes.sh
```

---

## Install the web interface

```bash
sudo mv lirc-web-remote /var/www/html/lirc-web-remote

sudo chmod a+x /var/www/html/lirc-web-remote/irsend_mult.sh
sudo chmod a+x /var/www/html/lirc-web-remote/macro.sh

sudo chown -R irsend /var/www/html/lirc-web-remote/data
```

---

## Notes

### Creating LIRC files
I used **IrScrutinizer** to help generate my LIRC configs.  
It’s extremely useful for building clean, consistent remote definitions.

---

## Macro Editor Development

I’m actively building a better macro editor.

- I have a slick idea for generating many editors automatically.
- `build_selector` will speed up development significantly.
- You can preview progress in **test_buildselector.html**.

---

## Future Plans

I’m exploring how to support **multiple modules** using **different remotes**.  
I’ll tackle that when I implement display editing and selection.
