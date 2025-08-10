# Noktra Airdrop

Nowoczesna, responsywna aplikacja webowa dla kampanii airdrop tokenów Noktra.

## 🚀 Funkcje

* **Responsywny Design**: Działa na urządzeniach desktop i mobilnych
* **Galeria NFT**: Prezentuje Kolekcję Genesis Noktra
* **Rejestracja Airdrop**: Formularz do zgłaszania adresów Solana
* **Wielojęzyczność**: Wsparcie dla języka polskiego i angielskiego
* **Nowoczesny UI**: Piękne efekty gradientowe i animacje
* **Przechowywanie Lokalne**: Śledzi zgłoszenia lokalnie w przeglądarce
* **Tryb Ciemny/Jasny**: Przełączanie między motywami
* **Walidacja Formularza**: Sprawdza poprawność adresów Solana

## 🛠️ Poprawki w wersji 41

* **Naprawiono ładowanie obrazów NFT** - lepsza obsługa błędów i fallback
* **Ulepszona responsywność** - lepsze wyświetlanie na urządzeniach mobilnych
* **Dodano walidację adresów Solana** - sprawdza format adresu przed wysłaniem
* **Poprawiono obsługę localStorage** - lepsze zarządzanie błędami
* **Zaktualizowano meta tagi** - lepsze SEO i social media
* **Naprawiono przełączanie języków** - poprawna aktualizacja wszystkich elementów
* **Ulepszona obsługa błędów** - lepsze komunikaty dla użytkowników

## 📁 Struktura Projektu

```
noktra-start-static/
├── index.html              # Główna strona aplikacji
├── style.css               # Główny arkusz stylów (v41)
├── script.js               # Główna logika JavaScript (v34)
├── logo.png                # Logo Noktra
├── .nojekyll               # Plik dla GitHub Pages
├── *.png                   # Obrazy NFT
└── README.md               # Ten plik
```

## 🚀 Uruchomienie

1. **Sklonuj repozytorium**
   ```bash
   git clone https://github.com/Robert710aa/noktra-start-static.git
   cd noktra-start-static
   ```

2. **Otwórz w przeglądarce**
   - Otwórz `index.html` w przeglądarce webowej
   - Aplikacja będzie działać natychmiast bez żadnych kroków budowania

3. **Lub uruchom lokalny serwer**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js
   npx serve .
   
   # PHP
   php -S localhost:8000
   ```

## 💻 Użycie

1. **Zobacz Galerię NFT**: Kliknij link "Galeria NFT Noktra" na górze
2. **Zarejestruj się do Airdrop**: Wypełnij formularz swoim adresem Solana, Twitter i Telegram
3. **Skopiuj Adres Tokenu**: Użyj przycisku "Kopiuj" aby skopiować adres tokenu NOK

## 🔧 Szczegóły Techniczne

* **Frontend**: Czysty HTML, CSS i JavaScript
* **Przechowywanie**: Lokalne przechowywanie przeglądarki
* **Sieć**: Integracja z blockchain Solana
* **Responsywność**: CSS Grid i Flexbox dla layoutu
* **Animacje**: CSS keyframes i transitions
* **Walidacja**: Regex dla adresów Solana

## 🌐 Wsparcie Przeglądarek

* Chrome (zalecane)
* Firefox
* Safari
* Edge

## 📱 Responsywność

Strona jest w pełni responsywna i działa poprawnie na:
* Desktop (1200px+)
* Tablet (768px - 1199px)
* Mobile (320px - 767px)

## 🎨 Motywy

* **Tryb Ciemny** (domyślny): Ciemne tło z jasnymi elementami
* **Tryb Jasny**: Jasne tło z ciemnymi elementami
* Automatyczne zapisywanie preferencji w localStorage

## 🌍 Języki

* **Polski** (domyślny)
* **Angielski**
* Automatyczne przełączanie wszystkich elementów interfejsu

## 📊 Licznik Odwiedzin

* Śledzi liczbę odwiedzin lokalnie w przeglądarce
* Resetuje się po wyczyszczeniu danych przeglądarki

## 🎉 Efekty

* **Confetti**: Efekt konfetti po udanym zgłoszeniu
* **Animacje**: Płynne animacje wejścia i hover
* **Tło**: Animowane kształty w tle

## 🐛 Znane Problemy

* Wszystkie znane problemy zostały naprawione w wersji 41
* Strona działa poprawnie na wszystkich nowoczesnych przeglądarkach

## 📝 Licencja

Ten projekt jest częścią ekosystemu Noktra.

## 📞 Kontakt

Więcej informacji o Noktra znajdziesz na oficjalnych kanałach.

## 🌟 O Projekcie

Noktra to osobiste marzenie, które staje się rzeczywistością. Dziękujemy, że jesteś tego częścią. Zrodzona z pasji, wiary i potrzeby stworzenia czegoś naprawdę własnego — Noktra to nie projekt, to uczucie. To początek podróży, która zaprowadzi ją do miejsca, gdzie cały świat usłyszy jej imię.

---

**Wersja**: 41  
**Ostatnia aktualizacja**: 2025  
**Status**: ✅ Wszystkie problemy naprawione
