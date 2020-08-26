const $target = document.getElementById("target");
const $fetchBtn = document.getElementById("fetch-btn");
const $message = document.getElementById("message");

const BASE_URL = "http://localhost:3000";

const MSG_FETCH = "사진을 가져오는 중 🐱";
const MSG_ABORT = "다른 사진을 찾는 중 🐱💦";
const MSG_DONE = "장난 아니지? 😎";
const MSG_SERVER_ERROR = "Internal Server Error ☹️";
const MSG_UNKNOWN_ERROR = "Unknown Error 😰";

let controller;
let isPending = false;

const getImage = async () => {
  try {
    if (isPending) {
      console.log("기존 요청을 취소합니다.");
      controller.abort();
    }

    controller = new AbortController();
    isPending = true;

    console.log("새로운 요청을 시작합니다.");
    $target.innerHTML = "";
    $message.innerHTML = MSG_FETCH;
    const res = await fetch(`${BASE_URL}/random`, {
      signal: controller.signal,
    });

    isPending = false;

    const { url } = await res.json();
    if (!url) throw new TypeError();

    $message.innerHTML = MSG_DONE;
    const img = document.createElement("img");
    img.src = url;
    $target.appendChild(img);
  } catch (err) {
    if (err instanceof DOMException) $message.innerHTML = MSG_ABORT;
    else if (err instanceof TypeError) $message.innerHTML = MSG_ERROR;
    else $message.innerHTML = MSG_UNKNOWN_ERROR;
  }
};

let timer;

const debounce = (callback, delay) => {
  if (timer) clearTimeout(timer);
  timer = setTimeout(callback, delay);
};

$fetchBtn.onclick = () => debounce(getImage, 500);
