let news = [];
let page = 1;
let total_pages = 0;
let articles = document.getElementById("news-board");
let navbar = document.querySelectorAll(".menus button");
let navbar2 = document.querySelectorAll(".side-nav-list button");
let inputTag = document.getElementById("input-tag");
let goButton = document.getElementById("go-button");
let searchNav = "sport";
let url = {};

goButton.addEventListener("click", () => {
  goButtonSearch();
});

navbar2.forEach((choice) => {
  choice.addEventListener("click", search);
});

navbar.forEach((choice) => {
  choice.addEventListener("click", search);
});

//카테고리 검색을 위해서 만든 함수
function search() {
  searchNav = event.target.textContent.toLowerCase();

  getLatestNews();
}

//각 함수에서 필요한 url을 만든다.
//api호출 함수를 부른다.
const getNews = async () => {
  try {
    let header = new Headers({
      "x-api-key": "m4S0KnIE_6VRNCb5NCydO1DKHHjiN9bzWVD2YMoenJ8",
    });
    url.searchParams.set("page", page);
    console.log(url);
    let response = await fetch(url, { headers: header }); //ajax, http, fetch 데이터를 보내는 방식(함수)
    let data = await response.json();

    if (response.status == 200) {
      if (data.total_hits == 0) {
        throw new Error("검색된 값이 없습니다.");
      }
      news = data.articles;

      total_pages = data.total_pages;
      page = data.page;

      console.log(news);
      console.log("response는", response);
      console.log("data는", data);
      render();
      pageNation();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    articles.innerHTML = `<div class="alert alert-danger" role="alert" style="text-align:center">
    ${error.message}
  </div>`;
  }
};

const getLatestNews = () => {
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=${searchNav}&page_size=10`
  );

  //url이라는 자바스크립트 제공 클래스를 쓰면 그냥 문자열로 url저장할때와 다르게
  //host가 누구고 서치하고 싶은 쿼리는 무엇인지 여러가지를 분석해줌.(객체형태로)

  getNews();
};

getLatestNews();

goButtonSearch = () => {
  let keyWord = inputTag.value;

  url = new URL(
    `https://api.newscatcherapi.com/v2/search?q=${keyWord}&countries=KR&page_size=10`
  );
  getNews();
};

//HTML의 기능 구현을 위한 이벤트 함수들
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

function search_event() {
  let search_point = document.getElementById("search-input");
  if (search_point.style.display == "none") {
    search_point.style.display = "inline";
  } else {
    search_point.style.display = "none";
  }
}

function input_tag() {
  document.getElementById("input-tag").placeholder = "";
}

//실제 api자료들을 받아와 화면에 랜더링 해주는 함수
let render = function () {
  let apiHTML = "";
  let renderPage = news;

  apiHTML = news
    .map((news) => {
      return `<div class="row news">
    <div class="col-lg-4">
      <img
        class="news-image"
        src="${
          news.media ||
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"
        }"
      />
    </div>
    <div class="col-lg-8">
      <h3>${news.title}</h3>

      <p>
        ${
          news.summary == null || news.summary == ""
            ? "내용없음"
            : news.summary.length > 200
            ? news.summary.substring(0, 200) + "..."
            : news.summary
        }
      </p>

      <div>${news.rights} * ${moment(news.published_date).fromNow()}</div>
    </div>
  </div>`;
    })
    .join("");

  //substring 문자열 (1,200)범위 지정 반환

  console.log(apiHTML);

  articles.innerHTML = apiHTML;
};

const pageNation = () => {
  let pageGroup = Math.ceil(page / 5);
  let pageNationHTML = "";

  let last = pageGroup * 5;
  let first = last - 4;
  let lastArrow = 0;

  if (last > total_pages) {
    lastCome = last - total_pages;
    last = last - lastCome;
    first = last - (4 - lastCome);
    lastArrow = first;
  }

  if (pageGroup > 1) {
    pageNationHTML = `
  <li class="page-item">
      <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(1)">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
    <li class="page-item">
  <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${
    page - 1
  })" >
    <span aria-hidden="true">&lt;</span>
  </a>
</li>`;
  }
  //total_page
  //page
  //page group
  //first
  //first~last 페이지 프린트

  //last
  //first

  for (let i = first; i <= last; i++) {
    pageNationHTML += `
    <li class="page-item ${page == i ? "active" : ""}">
      <a class="page-link" href="#" onclick="moveToPage(${i})">
        ${i}
      </a>
    </li>
    `;
  }

  if (pageGroup < Math.ceil(total_pages / 5)) {
    pageNationHTML += `<li class="page-item">
  <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${
    page + 1
  })" >
    <span aria-hidden="true">&gt;</span>
  </a>
</li>
<li class="page-item">
      <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(
        ${total_pages} 
      )" >
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>`;
  }
  document.querySelector(".pagination").innerHTML = pageNationHTML;
};

const moveToPage = (pageNum) => {
  //1.이동하고 싶은 페이지를 알아야한다.
  page = pageNum;

  //2.이동하고 싶은 페이지를 가지고 api를 다시 호출한다.
  getNews();
};
