---
"description": "After upgrading my pair of Lenovo M720q machines from Proxmox VE 8 to 9, they randomly started dropping their connection to the internet. Here's how I fixed it."
"pubDate": "Sun, 27 Sep 2026 15:41:12 GMT"
"keywords":
  - "keyword"
"image": null
"featured": false
"draft": false
---

# Proxmox Ethernet Failing After an Upgrade

After upgrading my pair of Lenovo M720q machines from Proxmox VE 8 to 9, they randomly started dropping their connection to the internet.
The only solution that seemed to fix it was to physically disconnect, then reconnect their Ethernet cables.
Weird, right?

I am honestly not sure why this was happening, but I can offer a permanent solution in case you (or anyone else) encounters this same problem.

## The Solution

First, find the label for the physical Ethernet adapter for your system:

``` bash
ip addr
```

For me, it was `eno1`.
The local address of your system might be bound to a virtual adapter (like `vmbr0`).
This is NOT what we are interested in.
We are interested in the __physical__ adapter.

Next, disable [TSO](https://phoenixnap.com/glossary/what-is-tcp-segmentation-offload/) for the live system. Substitute `eno1` for whatever you just found for the label of your Ethernet adapter.

```bash
ethtool -K eno1 tso off
```

To make this setting permanent, add a line to execute this on system boot to your `/etc/network/interfaces/` file.

```plaintext
iface eno1 inet manual
    post-up ethtool -K eno1 tso off
```

## Your Mileage May Vary

If you have this problem, this fix might work for you, and it might not.
Either way, good luck!
