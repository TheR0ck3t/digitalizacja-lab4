# Digitalizacja Lab 4

Aplikacja webowa do rozpoznawania twarzy na zdjęciach z wykorzystaniem API Luxand.

## Struktura projektu

```
lab4/
├── public/
│   ├── scripts/
│   │   └── upload.js         # logika przesyłania i wyświetlania wyników na froncie
│   └── styles/
│       └── main.css          # style aplikacji
├── routes/
│   ├── luxandUpload.js       # obsługa uploadu i komunikacji z API Luxand
│   └── public.js             # inne trasy publiczne
├── views/
│   └── public/
│       ├── index.ejs         # strona główna
│       └── uploadForm.ejs    # formularz uploadu zdjęcia
├── .env                      # zmienne środowiskowe (np. klucz API Luxand)
├── index.js                  # główny plik uruchamiający aplikację Express
├── package.json              # zależności projektu
└── package-lock.json
```

## Instalacja

1. Sklonuj repozytorium i przejdź do katalogu projektu.
2. Zainstaluj zależności:
   ```
   npm install
   ```
3. Utwórz plik `.env` z wymaganymi zmiennymi środowiskowymi, np.:
   ```
   LUXAND_API_KEY=twoj_klucz_api
   PORT=wybrany_port
   ```

## Uruchomienie

```
npm start
```
Aplikacja domyślnie działa na porcie 3000. Otwórz w przeglądarce: [http://localhost:3000](http://localhost:3000)

## Funkcjonalność

- Przesyłanie zdjęcia przez formularz.
- Wysyłka zdjęcia do backendu, który komunikuje się z API Luxand.
- Wyświetlanie wykrytych twarzy, płci, wieku, ekspresji oraz zaznaczanie prostokątów na zdjęciu.

## Pliki kluczowe

- `public/scripts/upload.js` – obsługa uploadu i wizualizacji wyników na froncie.
- `routes/luxandUpload.js` – obsługa uploadu i integracja z Luxand API.
- `views/public/uploadForm.ejs` – formularz do przesyłania zdjęć.

## Wymagania

- Node.js
- Klucz API Luxand (https://www.luxand.cloud/)

