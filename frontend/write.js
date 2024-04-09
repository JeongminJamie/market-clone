const form = document.getElementById("write-form");

async function handleSubmitForm(event) {
  event.preventDefault();

  const body = new FormData(form);
  // 세계시간 기준으로 시간을 보내줌(로직적으로 폼 데이터에서 보낼 때)
  body.append("insertAt", new Date().getTime());

  try {
    const res = await fetch("./items", {
      method: "POST",
      body,
    });
    const data = await res.json();
    if (data === "200") {
      window.location.pathname = "/";
    }
  } catch (e) {
    console.error(e);
  }
}

if (form) {
  form.addEventListener("submit", handleSubmitForm);
}
