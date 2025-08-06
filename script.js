document.addEventListener("DOMContentLoaded", () => {
  const counter = document.getElementById("submission-counter");
  const message = document.getElementById("message");
  const form = document.getElementById("airdrop-form");

  // Pobierz poczatkowa liczbe zgloszen
  fetch("/api/airdrop")
    .then(res => res.json())
    .then(data => {
      counter.textContent = data.count || 0;
    });

  // Obsługa wysylania formularza
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const address = document.getElementById("address").value;
    const twitter = document.getElementById("twitter").value;
    const telegram = document.getElementById("telegram").value;

    const res = await fetch("/api/airdrop", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address, twitter, telegram }),
    });

    const result = await res.json();
    message.textContent = result.message;

    if (res.status === 200) {
      form.reset();
      counter.textContent = parseInt(counter.textContent) + 1;
    }
  });
});
