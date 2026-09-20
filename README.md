# cra-kit

Source for the CRA / EU PLD kits storefront, served by GitHub Pages at
[cra.toledotechnologies.com](https://cra.toledotechnologies.com/)
(mirror: `kits.toledotechnologies.com`).

## What is in this repository

| Path | What it is |
|---|---|
| `index.html` | CRA 24-Hour Reporting Kit and Vulnerability Handling Starter Pack |
| `pld/index.html` | EU PLD kit |
| `check/index.html` | Free browser checker — runs entirely in the visitor's browser |
| `kev-mirror.json` | Data the checker reads |
| `CNAME`, `robots.txt`, `sitemap.xml` | Hosting and crawler configuration |

The paid kit files are **not** in this repository at `main` and are **not** served from
this site. Any `/d/...` path returns 404.

## How a purchase is delivered

Checkout is PayPal (Toledo Technologies LLC), mounted client-side on the pages above.
After payment the page shows the PayPal order reference and a prefilled
**"Email me my files"** message addressed to `dev@toledotechnologies.com`. The files are
sent by a person in reply to that message.

Keep the order reference: it is what identifies a purchase.

Two things this repository deliberately does **not** contain, because neither exists:

- no mailer — nothing here sends email, and no email is sent automatically on payment;
- no instant download link, and no automated fulfilment of any kind.

No turnaround time is promised anywhere, and none should be added to the pages.

## Refunds

As stated on the pages: if a kit is not what was expected, email within 14 days and the
payment is refunded through PayPal to the original payment method.

## Free parts

The browser checker here and the CLI at
[`ntoledo319/cra-watch`](https://github.com/ntoledo319/cra-watch) are free and
MIT-licensed. They are not crippled versions of the paid kits.

## What this is not

No compliance certification, no legal advice, no endorsement by ENISA, the European
Commission or CISA. No clients, results or testimonials — there are none.

## Editing these pages

The pages are plain HTML with no build step; GitHub Pages serves `main` as-is, so a push
to `main` is a deploy. There is no other checkout of record.
