// import { getAxios } from '../utils/axios';

export interface CartItem {
  id: number; // Products._id
  name: string; // Products.name
  price: number; // Products.price
  size: string;
  image: string; // Products.mainImages[0].path
  quantity: number;
  category?: string;
  gender?: string;
  styleNo?: string; // 필요 시
}

// // const axiosInstance = getAxios();

// 로컬 스토리지에서 장바구니 불러오기
function loadLocalCart(): CartItem[] {
  const cart = localStorage.getItem('cart');
  try {
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
}

// 로컬 스토리지에 장바구니 저장
function saveLocalCart(cartItems: CartItem[]) {
  localStorage.setItem('cart', JSON.stringify(cartItems));
}

// 장바구니 렌더링
function renderLocalCart() {
  const cartItems = loadLocalCart();
  console.log('장바구니 목록:', cartItems);
  const container = document.getElementById('cart-items');
  if (!container) return;

  container.innerHTML = '';

  if (cartItems.length === 0) {
    container.innerHTML = `<p class="text-center text-nike-gray-dark">장바구니가 비어있습니다.</p>`;
    updateTotalPrice();
    return;
  }

  cartItems.forEach((item: CartItem, index: number) => {
    const card = document.createElement('div');
    card.className = 'cart-item flex gap-4';

    card.innerHTML = `
    <div class="flex flex-col">
            <div class="flex gap-2">
              <img src="${item.image}" class="aspect-square w-[154px] h-[154px] rounded" alt="${item.name}" />
              <div class="grow min-w-0 flex flex-col justify-between">
                <div>
                  <p class="whitespace-nowrap font-medium text-base item-price">${(item.price * item.quantity).toLocaleString()} 원</p>
                  <p class="font-medium break-all whitespace-normal item-name">${item.name}</p>
                  <p class="text-sm text-nike-gray-dark flex flex-row gap-1">${item.gender || '남성 신발'}</p>
                  <p class="text-sm text-nike-gray-dark flex flex-row gap-1">${item.category || ''}</p>

                  <div class="text-sm text-nike-gray-dark flex flex-row gap-1">
                    <span class="flex flex-col">
                      <p class="pb-1">사이즈</p>
                      <button class="item-size hover:text-nike-gray-light cursor-pointer">${item.size}</button>
                    </span>

                    <span class="flex flex-col">
                      <p class="pb-1">수량</p>
                      <div>
                        <button type="button" aria-label="수량 감소" class="cursor-pointer hover:text-nike-gray-light minus">-</button>
                        <span class="item-quantity">${item.quantity}</span>
                        <button type="button" aria-label="수량 증가" class="cursor-pointer hover:text-nike-gray-light plus">+</button>
                      </div>
                    </span>
                  </div>

                  <div class="flex items-center gap-2 mt-1 text-sm text-nike-gray-dark">
                    <button type="button" class="cursor-pointer rounded-4xl hover:bg-nike-gray-lighter" aria-label="위시리스트">
                      <span><img src="../../public/assets/icon36px/icon-favorite.svg" alt="위시리스트" /></span>
                    </button>
                    <button type="button" class="cursor-pointer p-1.5 rounded-4xl hover:bg-nike-gray-lighter delete" aria-label="삭제">
                      <span><img src="../../public/assets/icon24px/icon-delete.svg" alt="삭제" /></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <!-- 이미지 밑에 위치하도록 이동 -->
            <div class="flex flex-col mt-2">
              <p class="pb-2">무료 배송</p>
              <span>도착 예정일: 7월 27일 (토) 배송 지역: <button class="cursor-pointer border-b font-semibold">36512</button></span>
            </div>
          </div>
    `;

    // 수량 감소
    card.querySelector('.minus')?.addEventListener('click', () => {
      if (item.quantity > 1) {
        item.quantity--;
        saveLocalCart(cartItems);
        renderLocalCart();
      }
    });

    // 수량 증가
    card.querySelector('.plus')?.addEventListener('click', () => {
      item.quantity++;
      saveLocalCart(cartItems);
      renderLocalCart();
    });

    // 삭제
    card.querySelector('.delete')?.addEventListener('click', () => {
      cartItems.splice(index, 1);
      saveLocalCart(cartItems);
      renderLocalCart();
    });

    container.appendChild(card);
  });

  updateTotalPrice();
}

// 총 금액 계산
function updateTotalPrice() {
  const cartItems = loadLocalCart();
  const totalPriceEl = document.querySelector('.total-price') as HTMLElement;
  if (!totalPriceEl) return;

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalPriceEl.textContent = total.toLocaleString() + ' 원';
}

// 초기 렌더링
renderLocalCart();
