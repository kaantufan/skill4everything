# Imagery: real photos, covers, portraits and artwork

Every screen that shows food, a place, a person, a cover or a map shows the real thing. This file lists photos that were checked one by one (HTTP 200, then looked at in a contact sheet) on 2026-11-11. Pick by what the content is: a kebab photo for a kebab restaurant, a bedroom for a sleep app. Keep light and crop consistent across one screen.

## Contents

- How to use a photo
- Licence
- Check before use
- Rules
- Photos by category
- Other sources
- Which table for which niche

## How to use a photo

Pattern, with the ID from the tables below:

```
https://images.unsplash.com/photo-<ID>?w=800&q=80&auto=format&fit=crop
```

- `w=400` for thumbnails, `w=1200` for a full-bleed hero. Add `&h=..` with `fit=crop` for a fixed ratio (`&ar=4:5` also works) and `dpr=2` for sharp phone screens.
- **Square avatar from a portrait:** `?w=96&h=96&fit=crop&crop=faces&dpr=2`. For a card: `&w=400&h=400&fit=crop&crop=faces`.
- A tiny blurred stand-in for blur-up: `?w=40&blur=50&q=20` (about 3.5 KB).
- Other working parameters: `crop=faces|entropy|top|center`, `fm=webp|avif|jpg`.
- Unsplash sends CORS headers, so reading the pixels for the dominant colour works with `crossorigin="anonymous"`.
- Every image slot gets the never-grey pattern: a coloured background close to the photo's dominant colour, a fade-in, and removal on error. Hard-code the colour per photo; never use a grey.
- Before a screenshot, wait for every image to decode (`scripts/capture.mjs` does).

## Licence

Unsplash licence: free for commercial and non-commercial use, no permission or attribution required (credit is appreciated), and the photos may not be sold unmodified or used to build a competing photo service. A prototype may carry a small "Photos: Unsplash" line. A shipped product should use the Unsplash API and its attribution rules instead of these IDs.

## Check before use

A photographer can delete a photo, and then the URL returns 404. The never-grey pattern covers it (the coloured box stays, the broken image is removed), but when the photo is the hero, open the URL once. Photographer names come from search listings and are best-effort ("n/a" where unknown).

## Rules

- **Portraits are adults only.** Give each a made-up name. Never present one as a real person's profile, review or testimonial.
- **No randomuser.me or pravatar.cc for anything shown larger than 48 px.** randomuser's large file is 128 px and looks soft; use a portrait below with `crop=faces`. For tiny 32-48 px chat avatars pravatar (`https://i.pravatar.cc/96?img=47`, img 1-70) is acceptable.
- **Art Institute of Chicago images cannot be hotlinked** (403 across origins). Use the Met, Cleveland or Wikimedia files below.
- `source.unsplash.com` is dead (503). `picsum.photos` picks a random subject: use it only for texture where the content does not matter.
- Do not use Unsplash+ (`plus.unsplash.com`) links; they are a paid licence.
- Text on a photo sits on a real scrim and passes contrast.

## Photos by category

Full URL for any ID: `https://images.unsplash.com/photo-<ID>?w=800&q=80&auto=format&fit=crop`.

### Turkish breakfast / table (food)
Top-down spreads, tea, sucuk and eggs.

| # | Photo ID | What it is | Credit |
|---|---|---|---|
| 1 | `1580069491658-8220b0e8722d` | sucuk + eggs breakfast | Aram Sabah |
| 2 | `1633040243823-6bf8d4edb0ec` | kahvalti spread | Omer Haktan Bulut |
| 3 | `1647772809798-f34d785c981c` | breakfast table | Lala Azizli |
| 4 | `1647772809729-7afb10f80766` | breakfast table + tea | Lala Azizli |
| 5 | `1658661521751-37eba144310a` | breakfast plates | Ruyan Ayten |
| 6 | `1614800443187-cc573044fa19` | many small dishes | Elif Nur |
| 7 | `1661685452870-e89b6e8c14fa` | top-down breakfast | Igor Sporynin |
| 8 | `1661685249316-a06e692e1cb2` | tea + coffee on kilim, moody | Igor Sporynin |
| 9 | `1690063860120-3521cead6c1c` | tea glass (cay), tall crop | Busra Salkim |
| 10 | `1548940740-204726a19be3` | soups / table | Victoria Shes |

### Grill, kebab, mezze, Mediterranean (food)
Turkish/Mediterranean dishes; first 5 are the most clearly Turkish.

| # | Photo ID | What it is | Credit |
|---|---|---|---|
| 1 | `1555939594-58d7cb561ad1` | kebab platter | Victoria Shes |
| 2 | `1620167790054-de54f34308bb` | kebab / pide plate | engin akyurt |
| 3 | `1699728088614-7d1d4277414b` | doner-style wrap | Yoad Shejtman |
| 4 | `1603360946369-dc9bb6258143` | skewers + fries | Markus Winkler |
| 5 | `1529006557810-274b9b2fc783` | wraps | Alexander Mils |
| 6 | `1619941862585-cd4fa9a4c2cb` | hummus bowls, top-down | Filipp Romanovski |
| 7 | `1620041328526-d0cf044a0739` | hummus + dips | Filipp Romanovski |
| 8 | `1715194288597-cd4df523776e` | hummus plate + flatbread | Alexandra Tran |
| 9 | `1542528180-0c79567c66de` | mezze plate | Louis Hansel |
| 10 | `1543340842-7b049d42a0ef` | mezze + salad | Louis Hansel |
| 11 | `1653611540493-b3a896319fbf` | mezze spread | Alexandra Tran |
| 12 | `1485963631004-f2f00b1d6606` | med. table spread | Brooke Lark |
| 13 | `1554998171-89445e31c52b` | med. platter + salad | Louis Hansel |
| 14 | `1523986371872-9d3ba2e2a389` | salad bowl | Jez Timms |
| 15 | `1529042410759-befb1204b468` | meatballs (kofte-like) + greens | n/a |
| 16 | `1504674900247-0877df9cc836` | grilled meat + greens, rustic | n/a |
| 17 | `1546069901-ba9599a7e63c` | grain bowl | n/a |
| 18 | `1565299624946-b28f40a0ae38` | pizza | n/a |
| 19 | `1567620905732-2d1ec7ab7445` | pancakes | n/a |
| 20 | `1512621776951-a57141f2eefd` | salad bowl, colourful | n/a |
| 21 | `1493770348161-369560ae357d` | brunch plates | n/a |
| 22 | `1414235077428-338989a2e8c0` | plated restaurant dish | n/a |

### Restaurant / cafe interiors

| # | Photo ID | What it is | Credit |
|---|---|---|---|
| 1 | `1517248135467-4c7edcad34c4` | dark dining room | Jason Leung |
| 2 | `1559339352-11d035aa65de` | waterfront terrace | Albert |
| 3 | `1551632436-cbf8dd35adfa` | restaurant interior | Louis Hansel |
| 4 | `1508424757105-b6d5ad9329d0` | greenhouse restaurant | kayleigh harrington |
| 5 | `1583354608715-177553a4035e` | blue booths | Klara Kulikova |
| 6 | `1494346480775-936a9f0d0877` | industrial restaurant | Nick Hillier |
| 7 | `1538333581680-29dd4752ddf2` | bright cafe-restaurant | Alexander Fae |
| 8 | `1555396273-367ea4eb4db5` | industrial hall | n/a |
| 9 | `1466978913421-dad2ebd01d17` | people sharing dishes (social) | n/a |

### Coffee / cafe

| # | Photo ID | What it is | Credit |
|---|---|---|---|
| 1 | `1509042239860-f550ce710b93` | lattes on table | Nathan Dumlao |
| 2 | `1495474472287-4d71bcdd2085` | cheers with coffees | Nathan Dumlao |
| 3 | `1511920170033-f8396924c348` | portafilter top-down | Nathan Dumlao |
| 4 | `1447933601403-0c6688de566e` | coffee beans | Mike Kenneally |
| 5 | `1453614512568-c4024d13c247` | cafe interior | Nafinia Putra |
| 6 | `1541167760496-1628856ab772` | latte pour | Fahmi Fakhrudin |
| 7 | `1512568400610-62da28bc8a13` | beans + latte | Nathan Dumlao |
| 8 | `1567880905822-56f8e06fe630` | white cafe interior | Keghan Crossland |
| 9 | `1600093463592-8e36ae95ef56` | plants cafe interior | Ruben Ramirez |

### Cappadocia (Turkey)

| # | Photo ID | What it is | Credit |
|---|---|---|---|
| 1 | `1695415683093-ae5f213ea898` | balloons, hero | Musa Ortac |
| 2 | `1604156789095-3348604c0f43` | balloons over valley | Timur Garifov |
| 3 | `1631152282084-b8f1b380ccab` | big balloon | yyzvic |
| 4 | `1559783510-c448bd7d686b` | valley + balloons | Tony Lee |
| 5 | `1627933577672-d191b77baa9c` | balloons, grey sky | Niketh Vellanki |
| 6 | `1641128324972-af3212f0f6bd` | balloons + rocks, saturated | Ramzi Belaidi |
| 7 | `1631724533937-687e6e60aafe` | cave hotel terrace | Rehina Sultanova |
| 8 | `1565694286329-16c31ae20a20` | fairy chimney detail | Utku Ozen |
| 9 | `1664733580167-c173c66db392` | sunrise balloons | Sean Lee |

### Istanbul (Turkey)

| # | Photo ID | What it is | Credit |
|---|---|---|---|
| 1 | `1524231757912-21f4fe3a7200` | Galata Tower | Anna Berdnik |
| 2 | `1589561454226-796a8aa89b05` | skyline + sea | Engin Yapici |
| 3 | `1527838832700-5059252407fa` | mosque at dusk | Fatih Yurur |
| 4 | `1636537511494-c3e558e0702b` | Maiden's Tower sunset | Ibrahim Uzun |
| 5 | `1623439844752-524658b16ce6` | Bosphorus mosque | Ibrahim Uzun |
| 6 | `1564407727371-3eece6c58961` | Ortakoy + bridge | Meric Dagli |
| 7 | `1626956291772-3aa243614fd0` | ferry + skyline | Hussein A.Kamal |
| 8 | `1518084823714-2f59a7315a39` | night, bridge lights | Osman Koycu |
| 9 | `1541432901042-2d8bd64b4a9b` | Blue Mosque | n/a |

### Aegean / Bodrum coast (Turkey; last 4 may be Greek islands)

| # | Photo ID | What it is | Credit |
|---|---|---|---|
| 1 | `1684858504602-677ac40eadfd` | terrace at sunset w/ flowers | Igor Pyrig |
| 2 | `1600500636274-2e64593efb62` | turquoise doors, white wall | gokhan polat |
| 3 | `1583062482795-d2bef78e9bc1` | palm + sea | Mert Kahveci |
| 4 | `1600194795031-e8c60926db4f` | aerial boats | Kaan Kosemen |
| 5 | `1595346471863-829e3fc915a1` | harbour town | Burcu |
| 6 | `1583061386694-e364c84ba31d` | bay + town | Mert Kahveci |
| 7 | `1591078314943-85c674b3789b` | harbour, gulets | Engin Yapici |
| 8 | `1607282677107-7f1bc094cc97` | white village over sea | Raimond Klavins |
| 9 | `1629458708127-2e0eb2a31973` | deep blue sea | Markos Mant |
| 10 | `1601179023714-ab50d8151fc2` | turquoise cove | Jacob Galuten |
| 11 | `1758971139390-b6b9734a45c7` | rocky coast | Seval Torun |

### Houses / stays / landscapes

| # | Photo ID | What it is | Credit |
|---|---|---|---|
| 1 | `1568605114967-8130f3a36994` | house at dusk, lit | n/a |
| 2 | `1564013799919-ab600027ffc6` | villa + pool | n/a |
| 3 | `1512917774080-9991f1c4c750` | modern white house | n/a |
| 4 | `1600585154340-be6161a56a0c` | modern house, garden | n/a |
| 5 | `1600596542815-ffad4c1539a9` | modern villa + pool | n/a |
| 6 | `1469854523086-cc02fe5d8800` | road trip, camper van | n/a |
| 7 | `1501785888041-af3ef285b470` | alpine lake | n/a |
| 8 | `1506905925346-21bda4d32df4` | mountains above clouds | n/a |

### Portraits, women (adults)
Square-crop tip: &w=400&h=400&fit=crop&crop=faces.

| # | Photo ID | What it is | Credit |
|---|---|---|---|
| 1 | `1580489944761-15a19d654956` | smiling, white shirt | Jake Nackos |
| 2 | `1531746020798-e6953c6e8e04` | pink wall | Jimmy Fermin |
| 3 | `1534528741775-53994a69daeb` | black tee, neutral | Aiony Haust |
| 4 | `1544005313-94ddf0286df2` | smiling, stripes | Stefan Stefancik |
| 5 | `1529626455594-4ff0802cfb7e` | red hair, side glance | Ayo Ogunseinde |
| 6 | `1438761681033-6461ffad8d80` | red hair, outdoors | Christopher Campbell |
| 7 | `1526510747491-58f928ec870f` | red hair, wood wall | Gabriel Silverio |
| 8 | `1573497019940-1c28c88b4f3e` | smiling, curly hair | Christina wocintechchat |
| 9 | `1531123897727-8f129e1688ce` | Black woman, collar | Prince Akachi |
| 10 | `1494790108377-be9c29b29330` | smiling, red sweater | n/a |
| 11 | `1524504388940-b1c1722653e1` | blonde, dark top | n/a |
| 12 | `1517841905240-472988babdf9` | laughing, denim hoodie | n/a |
| 13 | `1489424731084-a5d8b219a5bb` | freckles, red lips | n/a |

### Portraits, men (adults)

| # | Photo ID | What it is | Credit |
|---|---|---|---|
| 1 | `1500648767791-00dcc994a43e` | beard, neutral | Jurica Koletic |
| 2 | `1506794778202-cad84cf45f1d` | beard, dark | Albert Dera |
| 3 | `1507003211169-0a1dd7228f2d` | smiling, grey tee | Joseph Gonzalez |
| 4 | `1522556189639-b150ed9c4330` | light beard, smiling | Vince Fleming |
| 5 | `1568602471122-7832951cc4c5` | glasses, tee | Christian Buehner |
| 6 | `1623366302587-b38b1ddaefd9` | white bg, tee | Mostafa KordZangeneh |
| 7 | `1590086782792-42dd2350140d` | young, white bg | Ludovic Migneault |
| 8 | `1542327897-d73f4005b533` | Asian man, hoodie | Jessica Radanavong |
| 9 | `1539571696357-5a69c17a67c6` | hat, light bg | ian dooley |
| 10 | `1560250097-0b93528c311a` | glasses + suit | LinkedIn Sales Solutions |
| 11 | `1472099645785-5658abf4ff4e` | bald, olive shirt | n/a |
| 12 | `1463453091185-61582044d556` | Black man, graffiti wall | n/a |
| 13 | `1519085360753-af0119f7cbe7` | suit, arms crossed | n/a |
| 14 | `1552374196-c4e7ffc6e126` | curly hair, close | n/a |

### Running / outdoor fitness

| # | Photo ID | What it is | Credit |
|---|---|---|---|
| 1 | `1456613820599-bfe244172af5` | trail runners | Urban Vintage |
| 2 | `1530143311094-34d807799e8f` | runner on ridge | Alessio Soggetti |
| 3 | `1486218119243-13883505764c` | runner on dirt road | Jenny Hill |
| 4 | `1498581444814-7e44d2fbe0e2` | mountain runner | Brian Metzler |
| 5 | `1547483238-f400e65ccd56` | tiny runner, huge landscape | Andrea Leopardi |
| 6 | `1552674605-db6ffd4facb5` | silhouettes at sunrise | n/a |
| 7 | `1571008887538-b36bb32f4571` | road running legs | n/a |
| 8 | `1476480862126-209bfaa8edc8` | orange shoes on stairs | n/a |
| 9 | `1452626038306-9aae5e071dd3` | marathon crowd, aerial | n/a |

### Bedroom / night / calm
Dark ones suit sleep or meditation screens.

| # | Photo ID | What it is | Credit |
|---|---|---|---|
| 1 | `1505693416388-ac5ce068fe85` | bright bedroom | n/a |
| 2 | `1522771739844-6a9f6d5f14af` | white bedroom | n/a |
| 3 | `1540518614846-7eded433c457` | bedroom, orange accents | n/a |
| 4 | `1552858725-a19e7fcd3ac4` | dark bedroom, bedside lamp | Jp Valery |
| 5 | `1587023705100-8094f8d47e86` | dark room, blinds, moody | Susan Q Yin |
| 6 | `1419242902214-272b3f66ee7a` | purple starry sky | n/a |
| 7 | `1520262494112-9fe481d36ec3` | lone tree in snow | Fabrice Villard |
| 8 | `1500530855697-b586d89ba3ee` | desert road canyon, dusk | Jake Blucker |
| 9 | `1500099817043-86d46000d58f` | hand over grey sea | Stormseeker |
| 10 | `1509114397022-ed747cca3f65` | pink clouds | Laura Vinck |

### Abstract (backgrounds and washes, not album covers)
Dominant-colour sampling works well on these.

| # | Photo ID | What it is | Credit |
|---|---|---|---|
| 1 | `1557683316-973673baf926` | blue-teal gradient | Luke Chesser |
| 2 | `1557683304-673a23048d34` | blue gradient | Luke Chesser |
| 3 | `1614851099511-773084f6911d` | red/magenta to blue gradient | Codioful |
| 4 | `1614850523011-8f49ffc73908` | deep blue gradient | Codioful |
| 5 | `1620641788421-7a1c342ea42e` | purple/pink shape | Milad Fakurian |
| 6 | `1604079628040-94301bb21b91` | orange blur | mymind |
| 7 | `1478760329108-5c3ed9d495a0` | dark teal nebula | Jeremy Bishop |
| 8 | `1557672172-298e090bd0f1` | pink/blue fluid | n/a |
| 9 | `1550684848-fac1c5b4e853` | colourful bubbles | n/a |
| 10 | `1541701494587-cb58502866ab` | ink smoke, blue/orange | n/a |
| 11 | `1558591710-4b4a1ae0f04d` | white waves, minimal | n/a |
| 12 | `1494232410401-ad00d5433cfa` | cassette tape, light bg | Namroud Gorguis |

### Music objects (records, turntables)

| # | Photo ID | What it is | Credit |
|---|---|---|---|
| 1 | `1602848597941-0d3d3a2c1241` | record, red label | Brett Jordan |
| 2 | `1616714109948-c74fe5029a4d` | amber turntable | Jakob Rosen |
| 3 | `1580656449278-e8381933522c` | record on yellow | Immo Wegmann |
| 4 | `1602848596718-45693ff58c78` | white-label record | Brett Jordan |
| 5 | `1603048588665-791ca8aea617` | turntable, dark | Andrea Cipriani |
| 6 | `1526394931762-90052e97b376` | turntable + plant | Kevin McCutcheon |
| 7 | `1596633313465-1256feb1c6d9` | record stacks | Samuel Regan-Asante |
| 8 | `1582730147924-d92f4da00252` | colourful 45s | Eric Krull |

### City / street / night street

| # | Photo ID | What it is | Credit |
|---|---|---|---|
| 1 | `1449824913935-59a10b8d2000` | day street, tall buildings | n/a |
| 2 | `1480714378408-67cf0d13bc1b` | golden-hour skyline | n/a |
| 3 | `1514565131-fce0801e5785` | skyline + One WTC | n/a |
| 4 | `1477959858617-67f85cf4f1df` | aerial city | n/a |
| 5 | `1506606401543-2e73709cebb4` | NYC at night | Zac Ong |
| 6 | `1505811210036-052144988918` | city night, light trails | Zac Ong |
| 7 | `1514439827219-9137a0b99245` | blue-hour skyline | Van Mendoza |
| 8 | `1495430288918-03be19c7c485` | wet green night street | Andre Benz |
| 9 | `1566276423184-a8c13d2a88a1` | dusk street, lamps (PNG) | Fawazlul Rizqi |

## Other sources

**Pexels** (free to use, no attribution required; do not sell unaltered). Pattern `https://images.pexels.com/photos/<id>/pexels-photo-<id>.jpeg?auto=compress&cs=tinysrgb&w=800`. Checked:

| ID | What it is |
|---|---|
| 1640777 | salad bowl |
| 376464 | pancakes |
| 262978 | restaurant |
| 1181690 | woman portrait |
| 220453 | man portrait (800x1200) |

**The Met, CC0** (artwork for an art, museum or editorial product only; for album covers use photos with a subject, such as portraits, city at night or music objects, because a famous painting reads as pastiche and a soft abstract blur reads as a generated gradient). In a headless capture the host refused `crossorigin="anonymous"` loads, so load these without the attribute and hard-code the fallback and tint colour instead of sampling it:

| URL | Work |
|---|---|
| `https://images.metmuseum.org/CRDImages/as/web-large/DP130155.jpg` | Hokusai, The Great Wave |
| `https://images.metmuseum.org/CRDImages/ep/web-large/DP-42549-001.jpg` | Van Gogh, Wheat Field with Cypresses |
| `https://images.metmuseum.org/CRDImages/ep/web-large/DT1502_cropped2.jpg` | Van Gogh, Self-Portrait with a Straw Hat |
| `https://images.metmuseum.org/CRDImages/ep/web-large/DP346474.jpg` | Van Gogh, Irises |
| `https://images.metmuseum.org/CRDImages/ep/web-large/DP-19279-001.jpg` | Van Gogh, La Berceuse |
| `https://images.metmuseum.org/CRDImages/ep/web-large/DP-25460-001.jpg` | Degas, Woman beside a Vase of Flowers |
| `https://images.metmuseum.org/CRDImages/rl/web-large/DT3154.jpg` | Van Gogh, Madame Roulin and Her Baby |
| `https://images.metmuseum.org/CRDImages/ep/web-large/DP145931.jpg` | Rembrandt as a Young Man |
| `https://images.metmuseum.org/CRDImages/ep/web-large/DP-25465-001.jpg` | Manet, The Monet Family in Their Garden |

To find more, use the search endpoint `/public/collection/v1.1/search?hasImages=true&q=...` (the v1 search was retired in 2026-10) and keep only objects with `isPublicDomain: true`.

**Cleveland Museum of Art, CC0.** The image loads in an `<img>`, but the host sends no CORS header, so the canvas cannot sample it: hard-code the hex. Pattern `https://openaccess-cdn.clevelandart.org/<accession>/<accession>_web.jpg`.

| Accession | Work |
|---|---|
| 1958.31 | Adeline Ravoux (Van Gogh) |
| 1958.39 | The Red Kerchief (Monet) |
| 1946.83 | Frieze of Dancers |
| 1962.37 | Cupid and Psyche |
| 1942.647 | The Burning of the Houses of Lords and Commons |
| 1978.63 | In the Waves |
| 1967.215 | Mondrian, Composition with Red, Yellow, and Blue |
| 1949.186 | Fight Between a Tiger and a Buffalo |

**Wikimedia Commons.** Most files are CC BY-SA, so the author and licence must be credited; check each file. Thumbnails work only at standard widths: 250, 330, 500, 960, 1280, 1920, 3840 (any other width returns 400). Pattern `https://upload.wikimedia.org/wikipedia/commons/thumb/<h>/<hh>/<File>/960px-<File>`. Checked:

| File | Licence |
|---|---|
| `f/f3/Cappadocia_March_2006.jpg` | CC BY-SA 3.0 |
| `8/89/Cappadocia_Balloon_Inflating_Wikimedia_Commons.JPG` | Benh, CC BY-SA 3.0 |
| `b/b6/Hot_Springs_of_Pamukkale_Turkey.jpg` | CC BY-SA 3.0 (tall, 960x1014) |
| `0/0d/Turkish_breakfast_photo1.jpg` | Sami Mlouhi, CC BY-SA 4.0 |
| `8/8f/Baklava_-_Turkish_special%2C_80-ply.JPEG` | Kultigin, public domain |

## Which table for which niche

| Niche | Tables |
|---|---|
| food-delivery, ecommerce (food) | Turkish breakfast, Grill and mezze, Restaurant and cafe interiors, Coffee |
| travel-transport, real-estate | Cappadocia, Istanbul, Aegean coast, Houses and stays |
| dating, social-messaging | Portraits (adults, made-up names) |
| fitness-health | Running and outdoor fitness |
| wellness-meditation | Bedroom, night and calm |
| media-streaming | Portraits, City / street / night street, Music objects |
| any city setting | City and street |
