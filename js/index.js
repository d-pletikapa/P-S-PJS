const disabledScroll = () => {
	const widthScroll = window.innerWidth - document.body.offsetWidth;
	document.body.scrollPosition = window.scrollY;

	document.body.style.cssText = `
	overflow: hidden;
	position: fixed;
	top: -${document.body.scrollPosition}px;
	left: 0;
	height: 100vh;
	width: 100vw;
	padding-right: ${widthScroll}px;
	`;
};
const enabledScroll = () => {
	document.body.style.cssText = `position: relative`;
	window.scroll({ top: document.body.scrollPosition });
};

{ //lesson-1
	const presentOrderBtn = document.querySelector('.present__order-btn');

	const pageOverlayModal = document.querySelector('.page__overlay_modal');

	const modalClose = document.querySelector('.modal__close');

	const handlerModal = (openBtn, modal, openSelector, closeTrigger, sk = 'medium') => {

		let opacity = 0;

		const speed = {
			slow: 15,
			medium: 8,
			fast: 1,
			default: 5,
		};

		const openModal = () => {
			disabledScroll();
			modal.style.opacity = opacity;
			modal.classList.add(openSelector);

			const timer = setInterval(() => {
				opacity += 0.02;
				modal.style.opacity = opacity;
				if (opacity >= 1) clearInterval(timer);
			}, speed[sk] ? speed[sk] : speed.default);
		};
		const closeModal = () => {
			enabledScroll();
			const timer = setInterval(() => {
				opacity -= 0.02;
				modal.style.opacity = opacity;
				if (opacity <= 0) {
					clearInterval(timer);
					modal.classList.remove(openSelector);
				}
			}, speed[sk] ? speed[sk] : speed.default);
		};

		openBtn.addEventListener('click', openModal);

		closeTrigger.addEventListener('click', closeModal);
		modal.addEventListener('click', (e) => {
			if (e.target === modal) { closeModal(); }
		});
	};

	handlerModal(presentOrderBtn, pageOverlayModal, 'page__overlay_modal_open', modalClose, 'medium');
}

{
	const headerContactsBurger = document.querySelector('.header__contacts-burger');
	const headerContacts = document.querySelector('.header__contacts');
	const handlerBurger = (openBtn, menu, openSelector) => {
		openBtn.addEventListener('click', () => {
			if (menu.classList.contains(openSelector)) {
				menu.style.height = '';
				menu.classList.remove(openSelector);
			} else {
				menu.style.height = `${menu.scrollHeight}px`;
				menu.classList.add(openSelector);
			}
			//menu.classList.toggle(openSelector);
		});

	};

	handlerBurger(headerContactsBurger, headerContacts, 'header__contacts_open');
}
// pageOverlayModal.classList.add('page__overlay_modal_open');
// pageOverlayModal.classList.remove('page__overlay_modal_open');
//header__contacts_open

{ // Lesson-3 Галлерея

	const portfolioList = document.querySelector('.portfolio__list');
	const pageOverlay = document.createElement('div');
	pageOverlay.classList.add('page__overlay');

	portfolioList.addEventListener('click', (e) => {

		//console.log(e.target);
		//console.log(e.target.closest('.card'));

		disabledScroll();
		const card = e.target.closest('.card');

		if (card) {
			document.body.append(pageOverlay);
			const title = card.querySelector('.card__client');
			const picture = document.createElement('picture');
			picture.style.cssText = `
				position:absolute;
				top: 20px;
				left: 50%;
				trasnform: translateX(-50%);
				width:90%;
				max-width: 1440px;
			`;
			picture.innerHTML = `
			<source srcset"${card.dataset.fullImage}.avif" type"image/avif">
			<source srcset"${card.dataset.fullImage}.webp" type"image/webp">
			<img src="${card.dataset.fullImage}.jpg" alt="${title.textContent}">	
			`;
			pageOverlay.append(picture);
			// const img = document.createElement('img');
			// img.style.cssText = `
			// position:absolute;
			// top: 20px;
			// left: 50%;
			// trasnform: translateX(-50%);
			// `;
			// img.src = `${card.dataset.fullImage}.jpg`;
			// pageOverlay.append(img);
		}
	});
	pageOverlay.addEventListener('click', () => {
		pageOverlay.textContent = '';
		pageOverlay.remove();
		enabledScroll();
	});


}

{ // Создание карточек на основе данных из JSON

	const COUNT_CARD = 2;
	const portfolioList = document.querySelector('.portfolio__list');
	const portfolioAdd = document.querySelector('.portfolio__add');

	//console.dir('portfolioAdd:', portfolioAdd);


	const getData = () => fetch('db.json')
		.then((response) => {
			if (response.ok) {
				return response.json();
			} else {
				throw `Что-то пошло не так, попробуйте позже, ошибка: ${response.status}`;
			}
		}).catch(error => console.error(error));

	//16:34
	const createStore = async () => {
		const data = await getData();
		return {
			data,
			counter: 0,
			count: COUNT_CARD,
			get length() {
				return this.data.length;
			},
			get cardData() {
				const renderData = this.data.slice(this.counter, this.counter + this.count);
				this.counter += renderData.length;
				return renderData;
			}
		};
	};

	const renderCard = data => {
		const cards = data.map(({ preview, year, type, client, image }) => {

			const li = document.createElement('li');
			li.classList.add('portfolio__item');
			li.innerHTML = `
						<article class="card" tabindex="0" role="button" aria-label="открыть макет"
							data-full-image="${image}">
							<picture class="card__picture">
								<source srcset="${preview}.avif" type="image/avif">
								<source srcset="${preview}.webp" type="image/webp">
								<img src="${preview}.jpg" alt="превью iphone" width="166" height="103">
							</picture>

							<p class="card__data">
								<span class="card__client">Клиент: ${client}</span>
								<time class="card__date" datetime="${year}">год: ${year}</time>
							</p>

							<h3 class="card__title">${type}</h3>
						</article>
			`;
			return li;
		});
		portfolioList.append(...cards);
	};


	const initPortfolio = async () => {
		const store = await createStore();
		renderCard(store.cardData);
		portfolioAdd.addEventListener('click', () => {
			renderCard(store.cardData);
			//console.log('', store.cardData);
			//console.log('', store.length, store.counter);
			if (store.length === store.counter) {
				portfolioAdd.remove();
			}

		});
	};
	initPortfolio();
}