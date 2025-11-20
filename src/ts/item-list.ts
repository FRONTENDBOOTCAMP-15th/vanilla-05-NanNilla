import type { Products } from '../types/products';
import { getAxios } from '../utils/axios';
import type { ItemListRes, CategoryListRes } from '../types/response';

// URL 파라미터
const params = new URLSearchParams(window.location.search);
const newQuery = params.get('extra.isNew');
const firstItemQuery = params.get('extra.category.0'); // 대분류
const secondItemQuery = params.get('extra.category.1'); // 중분류
const thirdItemQuery = params.get('extra.category.2'); // 소분류
const currentQuery = (firstItemQuery || secondItemQuery || thirdItemQuery || newQuery) as string;
let currentKey = '';

let gender = '';
let category = '';
let parent = '';
let depth: number;
let sort: number;
const detailed: string[] = [];

for (const [key, value] of params) {
  if (value === currentQuery) {
    currentKey = key;
  }
}
// 카테고리데이터 가져오기
async function getCategoryData() {
  const axios = getAxios();
  const url = '/codes';
  try {
    const { data } = await axios.get<CategoryListRes>(url);
    console.log(data);
    return data;
  } catch (err) {
    console.error(err);
  }
}

const categoryData = (await getCategoryData()) as CategoryListRes;
if (categoryData?.ok) {
  console.log('카테고리데이터', categoryData.item.flatten);
  console.log(categoryData?.item?.flatten[currentQuery]);

  // 성별과 어떤용도이고 더 구체적인
  if (categoryData.item.flatten[currentQuery]?.depth === 2) {
    gender = categoryData?.item?.flatten[currentQuery]?.parent === 'PC01' ? '남성' : categoryData.item.flatten[currentQuery].parent === 'PC02' ? '여성' : '키즈';
    category = categoryData.item.flatten[currentQuery]?.value;
    depth = categoryData.item.flatten[currentQuery].depth;
    parent = categoryData.item.flatten[currentQuery].parent as string;
    Object.values(categoryData.item.flatten).forEach((item) => {
      //PC010203
      if (item.parent === currentQuery) {
        detailed.push(item.value);
      }
    });
    console.log('parent', parent);
    console.log('gender', gender);
    console.log('category', category);
    console.log('depth', depth);
    console.log(depth);
  }
  if (categoryData.item.flatten[currentQuery]?.depth === 3) {
    gender = categoryData.item.flatten[currentQuery].parent?.substring(2, 4) === '01' ? '남성' : categoryData.item.flatten[currentQuery].parent?.substring(2, 4) === '02' ? '여성' : '키즈';
    category = categoryData.item.flatten[categoryData.item.flatten[currentQuery].parent as string].value;
    Object.values(categoryData.item.flatten).forEach((item) => {
      //PC010203
      if (item.parent === currentQuery.substring(0, 6)) {
        detailed.push(item.value);
      }
    });
    depth = categoryData.item.flatten[currentQuery].depth;
    parent = categoryData.item.flatten[currentQuery].parent as string;
    sort = categoryData.item.flatten[currentQuery].sort;
    console.log('parent', parent);
    console.log('gender', gender);
    console.log('category', category);
    console.log('depth', depth);
    console.log('sort', sort);
    console.log('세부 카테고리', detailed);
  }
}

console.log('현재 URL:', window.location.href);

let url = '/products';
if (newQuery) {
  const urlParams = encodeURIComponent(`{${currentKey}: ${newQuery}}`);
  url += `?custom=${urlParams}`;
} else if (currentQuery) {
  const urlParams = encodeURIComponent(`{"${currentKey}": "${currentQuery}"}`);
  url += `?custom=${urlParams}`;
}

// if (thirdItemQuery) {

//   gender = thirdItemQuery.substring(2, 4) === '01' ? '남성' : thirdItemQuery.substring(2, 4) === '02' ? '여성' : '키즈';
//   if (gender === '남성') {
//     category = thirdItemQuery.substring(4, 6) === '01' ? '용품' : thirdItemQuery.substring(4, 6) === '02' ? '신발' : '의류';
//   } else {
//     category = thirdItemQuery.substring(4, 6) === '01' ? '신발' : thirdItemQuery.substring(4, 6) === '02' ? '의류' : '용품';
//   }

//   const index = Number(thirdItemQuery.substring(6));

//   if (thirdItemQuery.substring(0, 6) === 'PC0101') {
//     detailed = PC0101.filter((_item, idx) => index === idx + 1);
//   }
//   if (thirdItemQuery.substring(0, 6) === 'PC0102') {
//     detailed = PC0102.filter((_item, idx) => index === idx + 1);
//   }
//   if (thirdItemQuery.substring(0, 6) === 'PC0103') {
//     detailed = PC0103.filter((_item, idx) => index === idx + 1);
//   }
//   if (thirdItemQuery.substring(0, 6) === 'PC0201') {
//     detailed = PC0201.filter((_item, idx) => index === idx + 1);
//   }
//   if (thirdItemQuery.substring(0, 6) === 'PC0202') {
//     detailed = PC0202.filter((_item, idx) => index === idx + 1);
//   }
//   if (thirdItemQuery.substring(0, 6) === 'PC0203') {
//     detailed = PC0203.filter((_item, idx) => index === idx + 1);
//   }
//   if (thirdItemQuery.substring(0, 6) === 'PC0301') {
//     detailed = PC0301.filter((_item, idx) => index === idx + 1);
//   }
//   if (thirdItemQuery.substring(0, 6) === 'PC0302') {
//     detailed = PC0302.filter((_item, idx) => index === idx + 1);
//   }
//   if (thirdItemQuery.substring(0, 6) === 'PC0303') {
//     detailed = PC0303.filter((_item, idx) => index === idx + 1);
//   }
// }

// 데이터 가져오기

async function getData(currentUrl: string) {
  const axios = getAxios();
  try {
    console.log('요청 URL:', currentUrl);
    const { data } = await axios.get<ItemListRes>(currentUrl);
    console.log('데이터', data);
    return data;
  } catch (err) {
    console.error(err);
  }
}

// 랜더 함수
function renderItemList(prds: Products[]) {
  let result;

  if (prds.length === 0) {
    result = `
    <figure class="prod1 invisible w-[calc((100%-6px)/2)] bg-nike-white nikeDesktop:w-[calc((100%-24px)/3)] nikeDesktop:px-2">
        <p class="trash-data" href="/"><img src="/api/dbinit/team-nike/uploadFiles/AIR_MAX_C_01.png" alt="" /> </p>
        <figcaption>
          <p href="/">
            <p class="text-sm text-nike-red px-3">신제품</p>
          </p>
        </figcaption>
      </figure>
      `;
  } else {
    result = prds
      .map((prd) => {
        return `
      <figure class="prod1 w-[calc((100%-6px)/2)] nikeDesktop:w-[calc((100%-24px)/3)] nikeDesktop:px-2">
        <a href="/src/pages/itemdetail?_id=${prd._id}">
          <img class="aspect-[1/1.25] w-full" src="${prd.mainImages[0].path}" alt="${prd.name} ${category} 이미지" />
        </a>
        <figcaption>
          <a href="/src/pages/itemdetail?_id=${prd._id}">
            ${prd.extra.isNew ? `<p class="text-sm text-nike-red px-3 nikeDesktop:px-0">신제품</p>` : ''}
            <p class="text-sm px-3 nikeDesktop:px-0">${prd.name}</p>
            ${gender === '남성' ? `<p class="text-sm text-nike-gray-dark font-normal px-3 nikeDesktop:px-0">남성 ${category}</p>` : ``}
            ${gender === '여성' ? `<p class="text-sm text-nike-gray-dark font-normal px-3 nikeDesktop:px-0">여성 ${category}</p>` : ``}
            ${gender === '키즈' ? `<p class="text-sm text-nike-gray-dark font-normal px-3 nikeDesktop:px-0">키즈 ${category}</p>` : ``}
            <p class="text-sm text-nike-gray-dark font-normal px-3 nikeDesktop:px-0">${prd.extra.color ? prd.extra.color.split('/').length : 1}개 색상</p>
            <p class="text-base px-3 nikeDesktop:px-0">${prd.price.toLocaleString()} 원</p>
          </a>
        </figcaption>
      </figure>
    `;
      })
      .join('');
  }

  const itemList = document.querySelector('.item-list-wrapper');
  if (itemList) {
    itemList.innerHTML = result;
  }
}

// 서브 카테고리 필터 랜더 함수
function renderFiliterList() {
  let result = ``;
  if (depth === 3) {
    result = detailed.map((item, index) => `<button class="text-nike-black text-[1rem] font-medium px-4 pb-3.5 nikeDesktop:ml-8 nikeDesktop:pb-[10.79px]"><a href="/src/pages/itemlist?extra.category.2=${parent}${index + 1 >= 10 ? index + 1 : '0' + (index + 1)}">${item}</a></button>`).join('');
  }
  if (depth === 2) {
    result = detailed.map((item, index) => `<button class="text-nike-black text-[1rem] font-medium px-4 pb-3.5 nikeDesktop:ml-8 nikeDesktop:pb-[10.79px]"><a href="/src/pages/itemlist?extra.category.2=${currentQuery}${index + 1 >= 10 ? index + 1 : '0' + (index + 1)}">${item}</a></button>`).join('');
  }
  const subWrapper = document.querySelector('.sub-categoty-wrapper');
  if (subWrapper) {
    subWrapper.innerHTML = result;
  }
}

function renderTitle(prds: Products[]) {
  let result = '';

  if (depth === 2) {
    result = `
    <h1 class="nike-title-mobile text-[1.25rem] px-5 pt-[13px] pb-[13px] mb-[15px] nikeDesktop:hidden">${gender} ${category}</h1>
    <h1 class="nike-title-desktop text-[1.25rem] px-12 pt-[17px] pb-[30px] hidden nikeDesktop:block nikeDesktop:whitespace-nowrap">${gender} ${category}(${prds.length})</h1>
    `;
  } else if (depth === 3) {
    result = `
    <h1 class="nike-title-mobile text-[1.25rem] px-5 pt-[13px] pb-[13px] mb-[15px] nikeDesktop:hidden">${gender} ${detailed[sort - 1]} ${category === '신발' ? ` ${category}` : ''}</h1>
    <h1 class="nike-title-desktop text-[1.25rem] px-12 pt-[17px] pb-[30px] hidden nikeDesktop:block nikeDesktop:whitespace-nowrap">${gender} ${detailed[sort - 1]}${category === '신발' ? ` ${category}` : ''}(${prds.length})</h1>
    `;
  } else if (newQuery) {
    result = `
    <h1 class="nike-title-mobile text-[1.25rem] px-5 pt-[13px] pb-[13px] mb-[15px] nikeDesktop:hidden">신제품</h1>
    <h1 class="nike-title-desktop text-[1.25rem] px-12 pt-[17px] pb-[30px] hidden nikeDesktop:block nikeDesktop:whitespace-nowrap">신제품 (${prds.length})</h1>
    `;
  }

  const nikeTitle = document.querySelector('.nike-title');
  if (nikeTitle) {
    nikeTitle.innerHTML = result;
  }
}

function renderTotalItem(prds: Products[]) {
  const result = `${prds.length}개의 결과`;

  const totalItem = document.querySelector('.total-item');
  if (totalItem) {
    totalItem.textContent = result;
  }
}

function renderHiddenTitle(prds: Products[]) {
  const length = prds.length;
  console.log('길이가 도대체 몇이야!!!!!!!!!!!', length); // 1

  const divEl = document.createElement('div');
  const pEl = document.createElement('p');
  if (depth === 2) {
    console.log('길이가 도대체 몇이야!!!!!!!!!!!', length);
    pEl.textContent = `${gender} ${category}(${length})`;
  } else if (depth === 3) {
    console.log('길이가 도대체 몇이야!!!!!!!!!!!', length);
    pEl.textContent = category === '신발' ? `${gender} ${detailed[sort - 1]} ${category}(${length})` : `${gender} ${detailed[sort - 1]}(${length})`;
  }
  divEl.appendChild(pEl);
  divEl.classList.add('hidden', 'nikeDesktop:block');
  pEl.classList.add('hidden-desktop-title', 'hidden', 'text-[1.25rem]', 'px-12', 'pb-[13px]', 'mb-[15px]', 'pt-[0px]');

  const itemList = document.querySelector('.filter-bar');
  const desktopBtn = document.querySelector('.desktop-button');

  if (itemList) {
    itemList.insertBefore(divEl, desktopBtn);
  }
}

// 초기 데이터 랜더
const data = await getData(url);

if (data?.ok) {
  console.log(data.item);
  renderItemList(data.item);
  renderTitle(data.item);
  renderHiddenTitle(data.item);
  renderTotalItem(data.item);
  renderFiliterList();
}

//필터바 닫힘 기능(성별, 키즈, 키즈연령, 가격대)
function setupToggle(triggerSelector: string, wrapperSelector: string) {
  const trigger = document.querySelector(triggerSelector);
  if (!trigger) return;

  trigger.addEventListener('click', () => {
    const wrapper = document.querySelector(wrapperSelector);
    const img = trigger.querySelector('img');

    wrapper?.classList.toggle('hidden');

    if (img) {
      const isUp = img.getAttribute('src') === '/assets/icon24px/icon-up.svg';
      img.setAttribute('src', isUp ? '/assets/icon24px/icon-down.svg' : '/assets/icon24px/icon-up.svg');
    }
  });
}

setupToggle('.gender', '.checkbox-gender-wrapper');
setupToggle('.is-kid', '.checkbox-kids-wrapper');
setupToggle('.kid-age', '.checkbox-kids-age-wrapper');
setupToggle('.price-range', '.checkbox-price-wrapper');

// 필터 숨기기
const hiddenBtn = document.querySelector('.item-filter-hidden');
hiddenBtn?.addEventListener('click', () => {
  const categoryWrapper = document.querySelector('.category-wrapper');
  const nikeTitle = document.querySelector('.nike-title');
  const hiddenTitle = document.querySelector('.hidden-desktop-title');
  const itemList = document.querySelector('.item-list-wrapper');
  itemList?.classList.toggle('ml-3');

  hiddenBtn.classList.toggle('open');

  const isHidden = hiddenBtn.textContent === '필터 숨기기';
  hiddenBtn.innerHTML = isHidden ? `필터 표시<img src="/assets/icon24px/icon-filter.svg" alt="필터이미지" />` : `필터 숨기기<img src="/assets/icon24px/icon-filter.svg" alt="필터이미지" />`;

  categoryWrapper?.classList.toggle('nikeDesktop:hidden');
  nikeTitle?.classList.toggle('nikeDesktop:hidden');
  hiddenTitle?.classList.toggle('hidden');
  console.log('아무문자들', queryArray);
});

// 정렬 버튼
const sortBtn = document.querySelector('.item-filter-sort') as HTMLElement;
const recommendBtn = document.querySelector('.recommend-sort');
const recentBtn = document.querySelector('.recent-sort');
const priceHighBtn = document.querySelector('.price-high-sort');
const priceLowBtn = document.querySelector('.price-low-sort');
const sortBtnImage = document.querySelector('.sort-btn-image');
const sortText = document.querySelector('.sort-text') as HTMLElement;

// 정렬 메뉴 토글
sortBtn?.addEventListener('click', () => {
  [recommendBtn, recentBtn, priceHighBtn, priceLowBtn].forEach((btn) => btn?.classList.toggle('hidden'));
  sortBtnImage?.setAttribute('src', sortBtnImage?.getAttribute('src') === '/assets/icon24px/icon-down.svg' ? '/assets/icon24px/icon-up.svg' : '/assets/icon24px/icon-down.svg');
});

// 공통 정렬 함수
async function handleSort(sortUrl: string, label: string) {
  const data = await getData(sortUrl);

  const nikeTitle = document.querySelector('.nike-title');
  const categoryWrapper = document.querySelector('.category-wrapper');
  const hiddenTitle = document.querySelector('.hidden-desktop-title');

  if (data?.ok) {
    console.log('무슨데이터들', data.item);

    renderItemList(data.item);
    renderTitle(data.item);
    renderHiddenTitle(data.item);
    renderTotalItem(data.item);
    renderFiliterList();
  }

  [recommendBtn, recentBtn, priceHighBtn, priceLowBtn].forEach((btn) => btn?.classList.add('hidden'));

  if (label) {
    sortText.textContent = `정렬기준:${label}`;
    sortBtnImage?.setAttribute('src', '/assets/icon24px/icon-down.svg');
  }

  if (!hiddenBtn?.classList.contains('open')) {
    nikeTitle?.classList.toggle('nikeDesktop:hidden');
    categoryWrapper?.classList.toggle('nikeDesktop:hidden');
    hiddenTitle?.classList.toggle('hidden');
  }
}

// 각 정렬 버튼에 대한 이벤트
priceHighBtn?.addEventListener('click', () => handleSort(url + `&sort={"price":-1}`, '높은 가격순'));
priceLowBtn?.addEventListener('click', () => handleSort(url + `&sort={"price":1}`, '낮은 가격순'));
recentBtn?.addEventListener('click', () => handleSort(url + `&sort={"createdAt":-1}`, '최신순'));
recommendBtn?.addEventListener('click', () => handleSort(url + `&sort={"extra.isNew":-1,"extra.isBest":-1}`, '추천순'));

// 모바일 필터 버튼
const mobileFilterBtn = document.querySelector('.item-filter');
const mobileFilterModal = document.querySelector('.mobile-filter-wrapper');
const mobileFilterExit = document.querySelector('.mobile-filter-exit');
const mobileFilterApply = document.querySelector('.mobile-filter-apply');

// 모바일 필터에서 필터 버튼누르면 모달이 나오게함
mobileFilterBtn?.addEventListener('click', function () {
  mobileFilterModal?.classList.toggle('hidden');
  document.body.style.overflow = 'hidden';
});

// 모바일 필터에서 닫기 버튼이나 적용 누르면 모달 끔
mobileFilterExit?.addEventListener('click', function () {
  mobileFilterModal?.classList.toggle('hidden');
  document.body.style.overflow = ''; // 모달이 열렸을때 body 스크롤 해제
});

let selectedPriceId = ''; // 선택된 가격대 저장

// 모바일에서 필터 기능
mobileFilterApply?.addEventListener('click', function () {
  // 선택된 정렬 옵션 가져오기
  const selectedSort = document.querySelector('input[name="mobile-sort"]:checked') as HTMLInputElement;
  const mobilePrice0To50 = document.querySelector('input[id="mobile-price-0-50"]:checked') as HTMLInputElement;
  const mobilePrice50To100 = document.querySelector('input[id="mobile-price-50-100"]:checked') as HTMLInputElement;
  const mobilePrice100To150 = document.querySelector('input[id="mobile-price-100-150"]:checked') as HTMLInputElement;
  const mobilePrice150To200 = document.querySelector('input[id="mobile-price-150-200"]:checked') as HTMLInputElement;
  const mobilePrice200Plus = document.querySelector('input[id="mobile-price-200-plus"]:checked') as HTMLInputElement;

  let sortUrl = '';
  let sortLabel = '';
  const queryArray = [];

  if (mobilePrice0To50) {
    queryArray.push({ price: { $gte: 0 } });
    queryArray.push({ price: { $lte: 50000 } });
    selectedPriceId = 'desktop-price-0-50';
  }
  if (mobilePrice50To100) {
    queryArray.push({ price: { $gte: 50000 } });
    queryArray.push({ price: { $lte: 100000 } });
    selectedPriceId = 'desktop-price-50-100';
  }
  if (mobilePrice100To150) {
    queryArray.push({ price: { $gte: 100000 } });
    queryArray.push({ price: { $lte: 150000 } });
    selectedPriceId = 'desktop-price-100-150';
  }
  if (mobilePrice150To200) {
    queryArray.push({ price: { $gte: 150000 } });
    queryArray.push({ price: { $lte: 200000 } });
    selectedPriceId = 'desktop-price-150-200';
  }
  if (mobilePrice200Plus) {
    queryArray.push({ price: { $gte: 200000 } });
    selectedPriceId = 'desktop-price-200-plus';
  }

  {
    if (secondItemQuery) {
      queryArray.push({ 'extra.category.1': secondItemQuery });
    }
    if (thirdItemQuery) {
      queryArray.push({ 'extra.category.2': thirdItemQuery });
    }
    // 만드는 JSON 구조 = {"$and":[ ... ]}
    const customObj = { $and: queryArray };

    // custom 파라미터 값만 인코딩
    const encoded = encodeURIComponent(JSON.stringify(customObj));

    sortUrl = `/products?custom=${encoded}`;
  }

  if (selectedSort && sortUrl) {
    // 가격대별이랑 정렬 동시
    const sortId = selectedSort.id;

    if (sortId === 'mobile-recommend-sort') {
      sortUrl += `&sort={"extra.isNew":-1,"extra.isBest":-1}`;
      sortLabel = '추천순';
    } else if (sortId === 'mobile-recent-sort') {
      sortUrl += `&sort={"createdAt":-1}`;
      sortLabel = '최신순';
    } else if (sortId === 'mobile-price-high-sort') {
      sortUrl += `&sort={"price":-1}`;
      sortLabel = '높은 가격순';
    } else if (sortId === 'mobile-price-low-sort') {
      sortUrl += `&sort={"price":1}`;
      sortLabel = '낮은 가격순';
    }
  } else if (!selectedSort && sortUrl) {
    //가격대별만
  } else {
    // 정렬만
    const sortId = selectedSort.id;

    if (sortId === 'mobile-recommend-sort') {
      sortUrl = url + `&sort={"extra.isNew":-1,"extra.isBest":-1}`;
      sortLabel = '추천순';
    } else if (sortId === 'mobile-recent-sort') {
      sortUrl = url + `&sort={"createdAt":-1}`;
      sortLabel = '최신순';
    } else if (sortId === 'mobile-price-high-sort') {
      sortUrl = url + `&sort={"price":-1}`;
      sortLabel = '높은 가격순';
    } else if (sortId === 'mobile-price-low-sort') {
      sortUrl = url + `&sort={"price":1}`;
      sortLabel = '낮은 가격순';
    }
  }
  console.log('sortUrl', sortUrl);

  // 정렬 적용
  if (sortUrl) {
    handleSort(sortUrl, sortLabel).then(() => {
      // 렌더링 완료 후 데스크톱 라디오 버튼 체크
      if (selectedPriceId) {
        const desktopRadio = document.querySelector(`input[id="${selectedPriceId}"]`) as HTMLInputElement;
        if (desktopRadio) {
          desktopRadio.checked = true;
        }
      }
    });
  }

  mobileFilterModal?.classList.toggle('hidden');
  document.body.style.overflow = ''; // 모달이 닫히면 body 스크롤 해제
});

const desktopPrice0To50 = document.querySelector('input[id="desktop-price-0-50"]') as HTMLInputElement;
const desktopPrice50To100 = document.querySelector('input[id="desktop-price-50-100"]') as HTMLInputElement;
const desktopPrice100To150 = document.querySelector('input[id="desktop-price-100-150"]') as HTMLInputElement;
const desktopPrice150To200 = document.querySelector('input[id="desktop-price-150-200"]') as HTMLInputElement;
const desktopPrice200Plus = document.querySelector('input[id="desktop-price-200-plus"]') as HTMLInputElement;

// 공통 가격 필터 함수 생성
const queryArray: any = [];
function handleDesktopPriceFilter(minPrice: number, maxPrice: number | null, mobileId: string, clickedButton: HTMLInputElement) {
  clickedButton.checked = true;

  let sortUrl = '';
  const sortLabel = '';

  queryArray.push({ price: { $gte: minPrice } });
  if (maxPrice !== null) {
    queryArray.push({ price: { $lte: maxPrice } });
  }

  selectedPriceId = mobileId;

  if (depth === 2) {
    queryArray.push({ 'extra.category.1': currentQuery });
  }
  if (depth === 3) {
    queryArray.push({ 'extra.category.2': currentQuery });
  }

  const customObj = { $and: queryArray };
  const encoded = encodeURIComponent(JSON.stringify(customObj));
  sortUrl = `/products?custom=${encoded}`;

  if (sortUrl) {
    handleSort(sortUrl, sortLabel);

    // 모바일 라디오 버튼 동기화
    const mobileRadio = document.querySelector(`input[id="${selectedPriceId}"]`) as HTMLInputElement;
    if (mobileRadio) {
      mobileRadio.checked = true;
    }
  }
}

// 각 데스크톱 라디오 버튼에 이벤트 리스너 연결
desktopPrice0To50?.addEventListener('click', function () {
  handleDesktopPriceFilter(0, 50000, 'mobile-price-0-50', desktopPrice0To50);
});

desktopPrice50To100?.addEventListener('click', function () {
  handleDesktopPriceFilter(50000, 100000, 'mobile-price-50-100', desktopPrice50To100);
});

desktopPrice100To150?.addEventListener('click', function () {
  handleDesktopPriceFilter(100000, 150000, 'mobile-price-100-150', desktopPrice100To150);
});

desktopPrice150To200?.addEventListener('click', function () {
  handleDesktopPriceFilter(150000, 200000, 'mobile-price-150-200', desktopPrice150To200);
});

desktopPrice200Plus?.addEventListener('click', function () {
  handleDesktopPriceFilter(200000, null, 'mobile-price-200-plus', desktopPrice200Plus);
});
