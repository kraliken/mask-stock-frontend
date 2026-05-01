# Mask Stock – Frontend

Webalkalmazás egészségügyi intézmények maszkrendelésének kezeléséhez. A felhasználók regisztrálhatnak, kórházakhoz kapcsolódhatnak, rendeléseket adhatnak le, és letölthetik a számlájukat.

> **Eredeti verzió:** az alkalmazás 2021 júniusában készült (utolsó commit: 2021. június 18.). A repository jelenlegi állapota az eredeti kódot tartalmazza kiegészítésekkel és javításokkal – ezek részletezése a [Javítások és kiegészítések](#javítások-és-kiegészítések-az-eredeti-kódhoz-képest) szekcióban található.

---

## Funkciók

- Felhasználói regisztráció és bejelentkezés (session-alapú autentikáció)
- Kórházi profilkezelés – kórházak hozzáadása a saját fiókhoz
- Maszkrendelés leadása: kórház és mennyiség megadásával
- Rendelési előzmények és számlák letöltése
- Szerverkapcsolat figyelése: betöltési állapot és hibaüzenet, ha a backend nem elérhető

---

## Technológiák

| Csomag | Verzió |
|--------|--------|
| React | 17 |
| React Router | 5 |
| Material-UI | 4 |
| SCSS | – |
| Create React App | 4 |

---

## Előfeltételek

- Node.js (ajánlott: v16–v22)
- Futó [Mask Stock backend](../backend) a `http://localhost:5000` címen

---

## Telepítés és indítás

```bash
# Függőségek telepítése
npm install

# Fejlesztői szerver indítása
npm start
```

Az alkalmazás a **http://localhost:3000** címen érhető el.

> **Node.js v17+ kompatibilitás:** A `react-scripts 4.x` webpack 4-et használ, amely inkompatibilis az OpenSSL 3.0-val (Node.js 17+). Az `npm start` és `npm run build` szkriptek automatikusan tartalmazzák a szükséges `NODE_OPTIONS=--openssl-legacy-provider` beállítást.

### Produkciós build

```bash
npm run build
```

Az optimalizált bundle a `/build` mappába kerül.

---

## Projektstruktúra

```
src/
├── components/
│   ├── Header/            # Navigációs fejléc, bejelentkezési állapot
│   ├── Homepage/          # Főoldal
│   ├── HospitalList/      # Kórházkiválasztó legördülő menü
│   ├── Login/             # Bejelentkezési oldal
│   ├── Register/          # Regisztrációs oldal
│   ├── Profile/           # Felhasználói profil, kórházak kezelése
│   ├── Order/             # Rendelési űrlap
│   └── OrderHistoryDemo/  # Rendelési előzmények és számla-letöltés
├── style/
│   ├── scss/              # SCSS forrásfájlok (változók, reset, oldalstílusok)
│   └── css/               # Fordított CSS (ne szerkeszd közvetlenül)
└── App.js                 # Gyökérkomponens: routing, globális állapot, loading/error kezelés
```

---

## Oldalak

| Útvonal | Leírás | Védett |
|---------|--------|--------|
| `/` | Főoldal | Nem |
| `/register` | Regisztráció | Nem |
| `/login` | Bejelentkezés | Nem |
| `/profile` | Felhasználói profil | Igen |
| `/order` | Rendelés leadása | Igen |
| `/orderhistory` | Rendelési előzmények | Igen |

---

## Backend kapcsolat

A frontend a CRA proxy konfigurációján keresztül (`package.json` → `"proxy"`) a `http://localhost:5000` címen futó REST API-t éri el. Autentikációhoz a sessionId-t localStorage-ban tárolja, és minden kéréshez `authentication` fejlécként küldi el.

Ha a backend nem elérhető, az alkalmazás betöltési animációt jelenít meg, majd egy piros figyelmeztető sávban tájékoztatja a felhasználót.

---

## Javítások és kiegészítések az eredeti kódhoz képest

### 1. Node.js v17+ kompatibilitás (`package.json`)

**Probléma:** A `react-scripts 4.x` által használt webpack 4 inkompatibilis az OpenSSL 3.0-val (Node.js 17+), ami `ERR_OSSL_EVP_UNSUPPORTED` hibát okozott indításkor.

**Megoldás:** Az `npm start` és `npm run build` szkriptekhez hozzáadva a `set NODE_OPTIONS=--openssl-legacy-provider` flag.

---

### 2. Szerverkapcsolat hibakezelése (`App.js`)

**Probléma:** Ha a backend nem futott, a `/hospitals` és `/sessions` végpontokra küldött `fetch` hívások kezeletlen `TypeError: Failed to fetch` hibával dobták el az alkalmazást (unhandled rejection).

**Megoldás:**
- Mindkét `fetch` híváshoz `.catch()` ág hozzáadva, amely `serverError` állapotba lép hiba esetén.
- A Header alatt egy piros figyelmeztető sáv jelenik meg, ha a szerver nem érhető el – az alkalmazás többi része (navigáció, routing) továbbra is működőképes marad.

---

### 3. Betöltési állapot (`App.js`)

**Probléma:** Az oldal azonnal renderelte a tartalmakat, miközben a szerver válaszára várt – ez villanást okozhatott, vagy félrevezető üres állapotot mutatott.

**Megoldás:**
- `loading` állapot hozzáadva, kezdeti értéke `true`.
- A kórházlista-lekérés `.finally()` ágában `loading` `false`-ra vált (sikeresen vagy hibával is).
- Betöltés közben Material-UI `CircularProgress` spinner és „Betöltés..." felirat látható; az oldalak és hibaüzenet csak a szerver válasza után jelennek meg.

---

### 4. ESLint figyelmeztetések javítása

**`Login.jsx` – `no-unused-vars`:**
- Az `userName` state be volt állítva a `useEffect`-ben (`setUserName('Signed in!')`), de sehol nem volt felhasználva a JSX-ben.
- Megoldás: a `userName` state és a `setUserName` hívás eltávolítva. Az átirányítás (`window.location.href`) megmaradt.

**`DownloadButton.jsx` – `react-hooks/exhaustive-deps`:**
- A `handleGetURL` függvény a `useEffect`-en kívül volt definiálva, de a dependency array üres volt `[]`, így a lint hiányzó függőségre figyelmeztetett.
- Megoldás: a `handleGetURL` függvény behelyezve a `useEffect` belsejébe; a dependency array-be az `invoiceId` prop kerül (helyes függőség, mert a fetch body-jában szerepel).

**`Profile.jsx` – `no-unused-vars`:**
- A `response` state fel volt állítva (`setResponse(res.msg)`), de sehol nem jelent meg a felületen.
- Megoldás: a `response` state és a `.then(res => setResponse(res.msg))` lánc eltávolítva.

---

### 5. Magyar nyelvű felület (lokalizáció)

**Probléma:** Az alkalmazás teljes felülete angol nyelvű volt, holott magyar felhasználóknak készült.

**Megoldás:** Az összes felhasználó által látható szöveg magyarra fordítva az alábbi fájlokban:

| Fájl | Érintett szövegek |
|------|-------------------|
| `Header.jsx` | Navigációs linkek, bejelentkezési állapot, kijelentkezés gomb |
| `Homepage.jsx` | Üdvözlő szöveg |
| `HospitalList.jsx` | Segédszöveg, alapértelmezett opció |
| `Login.jsx` | Oldal cím, mezőfeliratok, hibaüzenet, regisztrációs link |
| `Register.jsx` | Oldal cím, mezőfeliratok, hibaüzenet, bejelentkezési link |
| `Order.jsx` | Űrlap cím, sikeres rendelés üzenet, mezőfeliratok, gomb |
| `OrderHistoryDemo.jsx` | Instrukciós szöveg |
| `DownloadButton.jsx` | Számlaszám felirat, letöltés link, betöltés szöveg |
| `Profile.jsx` | Felhasználónév és kórházak fejlécek, küldés gomb |

---

### 6. Hibaüzenet betűtípusa (`App.js`)

**Probléma:** A piros szerver-hibaüzenet sávban a szöveg Times New Roman betűtípussal jelent meg, holott az alkalmazás egészében Roboto használatos.

**Megoldás:** A `fontFamily: '"Roboto", sans-serif'` property hozzáadva a hibaüzenet `div` inline stílusához. (Gyökéroka: a globális CSS csak a `h1–h5`, `a` és `p` tagekre állít be fontot, a sima `div` tartalma a böngésző alapértelmezett betűtípusát örökölte.)

---

### 7. Bejelentkezési validáció és hibakezelés (`Login.jsx`)

**Probléma:** A login form hiányos validációval rendelkezett – a fetch hívás üres mezőkkel is elindult, a backend válaszát pedig ellenőrzés nélkül tárolta sessionId-ként. Ha a backend `{ msg: 'User not found!' }` vagy `{ msg: 'Password incorrect!' }` objektumot küldött vissza (404), azt is eltárolta, és az átirányítás megtörtént, tehát nem létező felhasználóval is be lehetett „jelentkezni".

**Megoldás:**
- Fetch előtt üres mezők ellenőrzése – ha valamelyik hiányzik, a kérés el sem indul.
- `loginFailed` állapot hozzáadva a backend hibaválaszának jelzésére.
- A backend válasz ellenőrzése: ha `res.msg` létezik (hibaválasz), `loginFailed` állítódik be; csak érvényes session ID esetén történik tárolás és átirányítás.
- Két különböző hibaüzenet: üres mezőkre és hibás hitelesítő adatokra.

---

### 8. Regisztrációs visszajelzés lokalizálása (`Register.jsx`)

**Probléma:** Sikeres regisztráció esetén a backend által visszaküldött angol nyelvű szöveg (`Successful registration. Log in to continue.`) jelent meg közvetlenül a felületen.

**Megoldás:** A megjelenítés előtt az ismert backend üzenet magyar szövegre cserélve (`Sikeres regisztráció! A folytatáshoz jelentkezzen be.`). A `useEffect`-beli string-összehasonlítás érintetlen maradt, mivel az a backend válaszát vizsgálja.

---

### 9. Védett route-ok és helytelen átirányítás (`App.js`)

**Probléma:** A `/orderhistory` route nem bejelentkezett állapotban a `<Homepage>` komponenst mutatta a `/login`-ra való átirányítás helyett. A `/profile` és `/order` route-ok egyáltalán nem voltak védve.

**Megoldás:** Mindhárom védett route-on `<Redirect to='/login' />` kerül megjelenítésre, ha a `user` állapot üres.

---

### 10. Race condition a betöltési állapotban (`App.js`)

**Probléma:** A `loading` állapotot egyedül a kórházlista-lekérés `.finally()` ága vezérelte. Ha ez hamarabb fejeződött be, mint a session-ellenőrzés, a route-ok `user = ''` állapottal rendereltek, és a védett oldalakon azonnal `/login`-ra irányítottak – még bejelentkezett felhasználó esetén is.

**Megoldás:** Az egységes `loading` state helyett két külön állapot: `hospitalsReady` és `sessionReady`. A `loading` értéke ezekből számolt (`!hospitalsReady || !sessionReady`). A `sessionReady` kezdeti értéke `true`, ha nincs `sessionId` a localStorage-ban (nincs mit megvárni); ha van, `false`, és csak a session-check `.finally()`-jában vált `true`-ra. A route-ok így csak akkor renderelnek, ha mindkét kérés befejeződött.

---

### 11. Navigáció villogása és elrendezése (`Header.jsx`, `header.scss`)

**Probléma:** A Header a `loading` feltételen kívül renderelt, ezért a navigációs linkek azonnal megjelentek `user = ''` állapottal (nem-auth linkek), majd a session-ellenőrzés után váltottak az auth linkekre – ez látható villogást okozott. Emellett a `space-evenly` elrendezés miatt a logó pozíciója ugrott attól függően, hány elem volt mellette.

**Megoldás:**
- A `loading` prop átadva a Header komponensnek; a navigációs linkek csak `!loading` esetén renderelnek, így az auth állapot már biztosan ismert a megjelenítéskor.
- A „Főoldal" link átkerült a nem-auth ágba – bejelentkezve csak a logó és az auth linkek láthatók.
- A header elrendezése `space-evenly`-ről `flex-start` + `gap: 2rem` + `padding: 0 2rem`-re változott; a felhasználói info konténer `margin-left: auto`-t kapott, így mindig a jobb szélen jelenik meg.
