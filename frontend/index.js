const calculateTime = (timestamp) => {
  // 한국시간 UTC+9시간 - 9시간 : 세계 시간 기준으로 만들기
  const currentTime = new Date().getTime() - 9 * 60 * 60 * 1000;

  // new Date로 감싸는 이유는 그냥 숫자가 아닌 시간을 보기 위함
  const pastedTime = new Date(currentTime - timestamp);
  const hour = pastedTime.getHours();
  const minute = pastedTime.getMinutes();
  const second = pastedTime.getSeconds();

  if (hour > 0) {
    return `${hour}시간 전`;
  } else if (minute > 0) {
    return `${minute}분 전`;
  } else if (second > 0) {
    return `${second}초 전 `;
  } else return "방금 전 ";
};

const renderData = (data) => {
  const main = document.querySelector("main");

  data.sort().forEach(async (obj) => {
    const div = document.createElement("div");
    div.className = "item-list";

    const imgDiv = document.createElement("div");
    imgDiv.className = "item-list__img";

    const img = document.createElement("img");
    const res = await fetch(`/images/${obj.id}`);
    const blob = await res.blob(); // json 형식이 아닌 blob으로 백에서 보내줌으로 res.blob()
    const url = URL.createObjectURL(blob); //블롭의 주소를 만들어줌
    img.src = url;

    const infoDiv = document.createElement("div");
    infoDiv.className = "item-list__info";

    const infoTitleDiv = document.createElement("div");
    infoTitleDiv.className = "item-list__info-title";
    infoTitleDiv.innerText = obj.title;

    const infoMetaDiv = document.createElement("div");
    infoMetaDiv.className = "item-list__info-meta";
    infoMetaDiv.innerText = obj.place + " " + calculateTime(obj.insertAt);

    const infoPriceDiv = document.createElement("div");
    infoPriceDiv.className = "item-list__info-price";
    infoPriceDiv.innerText = obj.price;

    imgDiv.appendChild(img);

    infoDiv.appendChild(infoTitleDiv);
    infoDiv.appendChild(infoMetaDiv);
    infoDiv.appendChild(infoPriceDiv);

    div.appendChild(imgDiv);
    div.appendChild(infoDiv);

    main.appendChild(div);
  });
};

const fetchList = async () => {
  try {
    const res = await fetch("/items");
    const data = await res.json();
    renderData(data);
  } catch (e) {
    console.error(e);
  }
};

fetchList();
