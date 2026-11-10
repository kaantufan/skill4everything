# Araştırma özeti: mobile-ui-craft neye dayanıyor

Tarih: 2026-11-10. Bu dosya, skill yazılmadan önce yapılan araştırmanın özeti ve her eleştirinin skill'de neye dönüştüğünün kaydıdır. Yıldız sayıları ve tarihler o gün canlı okundu.

## Yöntem ve sınırlar

- Altı paralel araştırma: genel tasarım skill'leri, mobil-native skill'ler, platform kılavuzları, AI-slop, gerçek uygulamalar ve nişler, çoklu-AI skill formatı.
- Repolar yalnızca okundu (`gh api`, ham dosyalar, issue'lar). Hiçbiri klonlanmadı, kurulmadı, çalıştırılmadı.
- **Reddit ve X okunamadı.** Kullanılan araçlar reddit.com'a erişemiyor; Reddit yalnızca arama özetlerinde geçen alıntılar ve Reddit verisinden türetilmiş bir çalışma üzerinden dolaylı olarak var. Forum kanıtının asıl kaynağı Hacker News (tam yorum ağaçları), GitHub issue'ları, NN/g, Baymard, Apple ve Google ödül yazıları ve düzenleyici kararlar.
- Apple'ın HIG sayfaları ve m3.material.io kısmen işlenemedi; sayılar Apple belge JSON'ları, androidx kaynak dosyaları ve birden çok skill'in çapraz doğrulamasıyla alındı. Doğrulanamayan her şey skill'e ya hiç girmedi ya da "SDK'nda varsa" koşuluyla girdi.
- Bulgular uygulayıcı düzeyinde kanıttır. "Hangi teknik AI görünümünü ne kadar azaltır" sorusunu ölçen kontrollü bir çalışma bulunamadı.

## İncelenen başlıca repolar

| Repo | Yıldız | Güçlü yanı | Eleştiri / zayıflık |
|---|---|---|---|
| nextlevelbuilder/ui-ux-pro-max-skill | 147k | CSV veritabanları, arama scripti, 22 stack, veri hijyeni | Mobil içerik sığ (120 UX kuralının 8'i mobil; stack CSV'leri kod hijyeni). Bağımsız ölçüm (issue #484): tetiklenme %50, referans dosyaları 200 denemede hiç açılmadı, dosyaların %82'sine ulaşılmadı. Python yolu plugin dışında kırılıyor |
| anthropics/skills `frontend-design` | 191k (repo) | Konuya dayalı tasarım, planı "her işe bunu mu üretirdim" diye gözden geçirme, modelin kendi varsayılanlarını adlandırma | Yalnızca web. Yasak listesi yaklaşımı yeni bir aynılık üretiyor (issue #1808: sayfaların yarısında hap buton) |
| pbakaus/impeccable | 107k | PRODUCT.md/DESIGN.md, yüzey modları, 62 kurallı deterministik dedektör, ios.md/android.md | Ağır (45 referans, ilk çalıştırmada binary indirme), dedektör yalnızca web, skill'siz koşunun 7,6 katı maliyet |
| Leonxlnx/taste-skill | 113k | Sınıflandır-sonra-planla, bitiş kapısı (Stop hook) | Yalnızca şirket siteleri, Node 22 + Chrome gerektiriyor, uygulama arayüzüne uygun değil |
| Nutlope/hallmark | 52k | Tema dağıtarak yakınsamayı önleme, "asla uydurma metrik" kuralı | ~1 MB, kurulumdan sonra göreli linkler kırılıyor; HN'de "ekran görüntüleri neredeyse aynı" eleştirisi |
| vercel-labs/agent-skills | 34k | Etki seviyeli kural dosyaları, RN performans kuralları | Kurallar inceleme anında uzaktan çekiliyor (prompt injection riski, issue #91), 83 KB AGENTS.md tekrarları, görsel tasarım yok |
| emilkowalski/skills | 55k | Hareket zanaatı, sayılar, frekans kapısı, her kuralın gerekçesi | Hareket merkezli; yerleşim, renk, tipografi az |
| expo/skills | 4,1k | Bulunan en iyi mobil UI/UX içeriği: adlandırılmış native-slop işaretleri, haptik haritası, dört durum kuralı | Yalnızca RN/Expo, iOS ağırlıklı |
| android/skills (Google) | 10k | Edge-to-edge, IME, uyarlanabilir yerleşim, predictive back | Görsel tasarım ve Material temelleri bilinçli olarak kapsam dışı; animasyon skill'i yok |
| flutter/agent-plugins | 3,2k | Duyarlı yerleşim, yerleşim hatası teşhisi | Tema, tipografi, hareket, erişilebilirlik, platform uyarlaması yok |
| twostraws/SwiftUI-Agent-Skill | 6,5k | iOS 27 varsayımları, erişilebilirlik ve API doğruluğu | Yalnızca inceleme; tasarım yönü yok. Harfiyen uygulanınca kodu kötüleştiren kurallar (PR #14, #15) |
| CharlesWiltgen/Axiom | 1,3k | En derin HIG, Liquid Glass, haptik, SF Symbols içeriği | 289 skill; açıklamaların 216'sı bağlam bütçesinden düşüyor (issue #32) |
| enmerasoftware/ai-design-check | 242 | Native kaynak kodu okuyan tek linter; insan sitelerine karşı kıyaslama | Çok yeni. Kıyaslaması, bazı ünlü "AI işaretlerinin" artık AI çıktısında görülmediğini gösteriyor |

Toplamda yaklaşık 90 repo ve 5 dizin tarandı. Dizinlerdeki kurulum sayıları güven sinyali değil: 28 yıldızlı, ücretli bir API istemcisi skills.sh'te 1,3 milyon kurulumla 7. sırada.

## Eleştiriden tasarım kararına

| Tekrarlayan eleştiri (kanıt) | Bu skill'deki karşılığı |
|---|---|
| Çok ağır, token yiyor (Hallmark #50, Vercel #169, UIPM #484, 1,6-7,6 kat maliyet ölçümü) | SKILL.md 185 satır, yaklaşık 4 bin token. Görev başına okuma bütçesi: bir platform, bir niş, bir-iki görev dosyası. Her niş ayrı ve kısa dosya |
| Referans dosyaları hiç açılmıyor (UIPM #484) | Yönlendirme tabloları SKILL.md'nin içinde ve "şu durumda şunu oku" biçiminde. Her zaman geçerli 12 kural (taban) referansta değil, SKILL.md'de |
| Skill tetiklenmiyor (Vercel: %56 hiç çağrılmadı; AGENTS.md dizini %100) | Açıklama niyet odaklı ve ısrarcı. Ayrıca projenin AGENTS.md/CLAUDE.md dosyasına eklenebilen on satırlık `assets/always-on.md` |
| Çıktılar yeni bir aynılığa yakınsıyor (HN, Anthropic #1808, krem + serif + kiremit kümesi) | Skill'de palet, hex ya da font listesi yok. Renk ve biçim ürünün kendi dünyasından türetiliyor. Her nişte hem klişe hem aşırı düzeltme adlandırılıyor. "İkinci dalga" işaretleri ayrıca listeli |
| Yalnızca web, platform kurallarını yok sayıyor | Her platform için ayrı dosya (HIG/SwiftUI, Material 3/Compose, Flutter, React Native) ve iki platforma tek koddan çıkanlar için iOS-Android farkları tablosu |
| Web'in "sistem fontundan kaçın" öğüdü mobilde yanlış | Açıkça tersine çevrildi: native'de sistem fontu doğrudur; kimlik hiyerarşiden ve fontun kendi varyantlarından gelir |
| Doğrulama adımı yok, kurallar umuda kalıyor | Zorunlu render döngüsü, kanıt merdiveni, Swift/Kotlin/Dart/TSX okuyan bağımlılıksız tarayıcı (`slop-scan.mjs`), raporda zorunlu "Doğrulanmadı" satırı |
| Çalışma zamanı bağımlılığı ve kırık yollar (Python yolu, binary indirme, `curl \| bash`) | Tek script, yalnızca Node standart kütüphanesi, ağ erişimi yok. Node yoksa aynı imzalar elle grep'lenebiliyor. Kurulum scripti yok |
| Uydurma içerik (tüm skill'ler metrik ve müşteri uydurdu) | "Asla gerçek uydurma" ilk iki kuraldan biri; örnek veri örnek olarak etiketleniyor |
| Uzaktan içerik çekme ve izin riskleri (Vercel #91, UIPM #333) | Hiçbir şey uzaktan çekilmiyor, hiçbir ayar dosyasına dokunulmuyor |
| Bayat içerik, uydurma API adları (hig-doctor #196, twostraws #28-30) | Her platform dosyasında taban tarihi; "SDK ve resmi belge kazanır" kuralı; doğrulanamayan API adları koşullu yazıldı ya da çıkarıldı |
| Harfiyen uygulanınca zarar veren kurallar | Kurallar gerekçeleriyle yazıldı; "brief kazanır"; inceleme modunda en fazla sekiz gerçek bulgu, platform deyimleri işaretlenmiyor |
| Mobilde niş bazlı tasarım rehberi yok | 24 niş dosyası: kullanıcı anı, yapı, görünüm, güven sinyalleri, durumlar, reddedilecek karanlık kalıplar, örnek alınacak uygulamalar |

## AI-slop bulguları

- En büyük şikâyet tek bir özellik değil, aynılık. Reddit verisinden türetilmiş bir çalışmada (3.033 yorum) "AI diye bağırıyor" ve "hepsi aynı" kovaları, mor renk ya da gradyan gibi tekil işaretlerin çok önünde.
- İşaret, kimsenin seçmediği bir varsayılandır; AI kanıtı değildir. Bu yüzden kurallar "X'ten kaçın" değil, "karar ver" biçiminde yazıldı.
- Yasak listeleri ikame üretir: Inter yerine başka bir moda font, mor yerine krem ve kiremit. Anthropic'in kendi skill'i adlandırılmış yasak listesini bırakıp kümeleri tarif etmeye geçti.
- Mobilde ana eksen "taşınmış web sitesi": telefon çerçevesinde hero, hamburger menü, elle yazılmış başlık ve sekme çubuğu, sabit güvenli alan sayıları. Ayna hatası da var: şablon tohum renkleri ve stilsiz liste.
- Üretilmiş uygulamalar en çok eksik durumlarda ve gerçek içerik stresinde açık verir: boş, yükleniyor, hata, çevrimdışı, 40 karakterlik isim, bin satır.

## Kullanıcı eleştirileri

En çok tekrarlanan şikâyetler ve skill'deki yeri:

1. Abonelik tuzakları: kolay giriş, gizli iptal (FTC'nin Amazon Prime kararı dahil). `ux-flows.md`, ödeme duvarı bölümü.
2. Gizli ve son adımda çıkan ücretler (yemek teslimatı ve seyahat). Fiyat bölümü ve ilgili niş dosyaları.
3. Değer görmeden zorunlu hesap; ilk açılışta bildirim izni. İlk çalıştırma ve izin bölümleri, tabanın 11. maddesi.
4. Liquid Glass okunabilirliği (NN/g eleştirisi, HN'de 526 yorum). iOS dosyası: cam yalnızca kontrol katmanında, cam üstüne cam yok.
5. Material 3 Expressive: yoğunluk kaybı, etiketsiz düğmeler (Google'ın kendi araştırması da küçük bir azınlığın daha sakin tasarımı yeğlediğini söylüyor). Android dosyası: ifade yalnızca bir-iki birincil eylemde.
6. Gizli gezinme, alt sayfa (sheet) istismarı, kaybolan kaydırma konumu, her gün kullanılan şeyleri taşıyan yeniden tasarımlar. Hepsi `ux-flows.md` içinde.
7. Seri (streak) baskısı ve oyunlaştırma: sağlık, para ve ruh sağlığı nişlerinde reddedilecekler listesinde.

Övülen uygulamalar için en güvenilir kanıt ödüller oldu (Apple Design Awards 2024-2026, App Store Awards 2025, Google Play Best of 2025). Niş dosyalarındaki "örnek al" bölümleri yalnızca kaynaklı ya da ödüllü örnekleri kesin dille anıyor; diğerleri "sıkça anılan" diye işaretli.

## Platform taban çizgisi

2026-11-10 itibarıyla kontrol edilenler: iOS/iPadOS 26 ve iOS 27 duyuruları, Material 3 Expressive ve Compose `material3` 1.4/1.5, Android 16/17 davranış değişiklikleri, Flutter 3.47 ve 3.50 beta, React Native 0.88 ve Expo SDK 58, WCAG 2.2. Ayrıntı ve sayılar `skills/mobile-ui-craft/references/` altındaki platform dosyalarında.

## Sürüm 2: araştırmanın gözden kaçırdığı şey

İlk sürüm bu araştırmanın doğrudan ürünüydü: platform kuralları, AI işaretlerinin temizlenmesi, ölçülülük. İddia tabanlı testte iyi sonuç verdi (46/47'ye karşı 27/47) ama çıktılar "daha temiz" olmaktan öteye geçmedi. Araştırmadaki uyarı doğru çıktı, yalnızca ters yönden: yasak listeleri yeni bir aynılık üretiyorsa, ölçülülük kuralları da üretiyor. İlk sürümün yasakladığı şeylerin çoğu (cesur renk, karakterli font, özel gezinme, cam, yaylanma) seçilmediklerinde şablon, bir fikirden türetilip bitirildiklerinde kimlik.

İkinci sürümün ekledikleri:

- Her ekran için ürünün kendi dünyasından tek bir fikir ve ekranın asıl verisini taşıyan bir merkez öğe zorunlu.
- Dördüncü kadran: İfade (X). Varsayılan 4; iş araçlarında 1-2.
- Durağan mockup yerine hareketli prototip ve onu gerçek zamanlı yakalayan bağımlılıksız bir script.
- İşaret kataloğu "kaçın" listesinden "seçilmemiş varsayılan" tanımına çevrildi; en derin işaret artık fikirsiz ekran.

Sekiz nişlik kör kıyaslamanın (Opus 5.5 high, niş başına iki puanlayıcı) sonucu README'de: skill'li tasarım 16 kararın 15'inde tercih edildi; kimlik 8,4'e karşı 4,9, etki 7,9'a karşı 5,3, netlik ise 6,8'e karşı 8,2. Netlikteki kayıp, merkez öğenin içeriği ekran dışına itmesi ve yüzen öğelerin içeriği örtmesinden geldi; ikisi de skill'e kural olarak işlendi ama yeniden ölçülmedi.

Tetiklenme ölçümü de araştırmadaki Vercel bulgusunu bu kurulumda doğruladı: 800'den fazla skill kuruluyken Claude Code skill açıklamalarının çoğunu göstermiyor, skill gerçek bir projede yaklaşık beş koşudan birinde kendiliğinden yükleniyor; `CLAUDE.md`'ye eklenen on satırlık blokla 20/20.

## Sürüm 3: modelin kendi zevki de bir işaret

Kullanıcı geri bildirimi: 2.0 çıktıları yazı tiplerinden başlayarak hâlâ AI yapımı görünüyor. 17 çıktıda sayım bunu doğruladı: aynı serif başlık (Fraunces) sekiz ekranın beşinde, Google web fontu sekizde sekiz, elle çizilmiş SVG ikonlar sekizde sekiz, orta noktayla dizilmiş künye sekizde yedi, ışık efekti olarak radyal gradyan sekizde yedi. Yasak listesi bunu çözmez: aynı seçici bir sonraki favorisine geçer. Karar, seçimi modelden almak oldu.

- Yazı tipi, ikon seti, iskelet, gezinme, köşe, zemin, palet yapısı, efekt bütçesi, ses, merkez öğe türü, renk tonu aralığı ve ilk görünüm ürün adından tohumlanan bir script ile dağıtılıyor (`scripts/deal.mjs`).
- Model resim ve ikon çizmiyor; görsel gereken yer yazısız bir alan.
- Ölçüt, AI tespit testi oldu: kör hakemler her ekrana "AI yaptı" olasılığı verdi.

İlk tespit turunun 3.0 için bulduğu işaretler yazı tipinde değil metindeydi: ekrana sızmış yapım notları, veriyi anlatan cümleler, özenli uydurma yerel veri, ürüne özel grafik gösterişi, siyah zemin üstünde tek pembe vurgu. 3.1 bunları kural yaptı ve bir sonraki turda ortalama AI olasılığı 85'ten 80'e, "en AI" seçilme 16 kararda 3'ten 0'a indi (skill'siz: 88 ve 13). Kalan işaretler (her ekranda dev sayı ve küçük birim, bazı ürüne özel grafikler) kurala çevrildi, yeniden ölçülmedi.

## Bilinen boşluklar

- Reddit ve X konuları doğrudan okunmadı.
- AI asistan, B2B/saha, sağlık hizmeti, emlak ve yaratıcı araç nişlerinde nişe özel şikâyet verisi zayıf; o dosyalar daha çok genel bulgulara ve teamüle dayanıyor.
- Tarayıcı kuralları gerçek, büyük bir mobil kod tabanında yanlış pozitif açısından denenmedi.
- 2.0 sonrası netlik düzeltmeleri ve 3.1 sonrası son iki kural yeniden ölçülmedi.
- AI tespit testinde gerçek uygulama görselleri pazarlama görselleridir; gerçek fotoğraf ve marka içeriği onları ayırıyor, bu yüzden "gerçekten ayırt edilemez mi" sorusunu bu test cevaplayamaz.
- Hakemler üreticiyle aynı model ailesinden; insan bir uzmanla test edilmedi.
- Hiçbir tasarım simülatörde ya da cihazda native olarak kurulup denenmedi.
