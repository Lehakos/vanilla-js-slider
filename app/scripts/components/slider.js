(function() {
  const classes = {
    active: 'slider__item_active',
    animOut: 'slider__item_animation-out',
    arrow: 'slider__arrow',
    wrapper: 'slider__wrapper'
  };

  class Slider {
    constructor(el, options) {
      this.el = el;
      this.items = el.querySelectorAll('.slider__item');
      this.active = 0;
      this.animationStarted = false;

      this.options = Object.assign(
        {
          speed: 1000,
          arrows: true,
          arrowsContainer: '',
          arrowClass: '',
          autoPlay: false,
          autoPlayTime: 4000
        },
        options
      );

      this._init();
    }

    _init() {
      this._createWrapper();

      if (this.options.arrows) {
        this._createArrows();
      }

      if (this.options.autoPlay) {
        this._runAutoPlay();
      }

      this.items[this.active].classList.add(classes.active);

      this._handleEvents();
    }

    nextSlide() {
      const activeItem = this.items[this.active];
      let nextSlide = this.active + 1;

      if (!activeItem.nextElementSibling) {
        nextSlide = 0;
      }

      this.changeSlide(nextSlide);
    }

    prevSlide() {
      let nextSlide = this.active - 1;

      if (nextSlide < 0) {
        nextSlide = this.items.length - 1;
      }

      this.changeSlide(nextSlide);
    }

    changeSlide(num) {
      if (this.animationStarted) {
        return;
      }

      const prevActive = this.items[this.active];
      const newActive = this.items[num];
      const animate = APP.namespace('modules.helpers.animate');

      this.animationStarted = true;
      this.active = num;

      prevActive.classList.add(classes.animOut);
      prevActive.classList.remove(classes.active);
      newActive.classList.add(classes.active);

      this.animation = animate({
        duration: this.options.speed,
        draw: progress => prevActive.style.opacity = 1 - progress,
        onAnimationEnd: () => {
          this._resetStylesAfterAnimation(prevActive);
          this.animationStarted = false;
        }
      });

      if (this.options.autoPlay) {
        this._refreshTimer();
      }
    }

    _handleEvents() {
      const onArrowClick = arrow => {
        const type = arrow.getAttribute('data-type');

        if (type === 'next') {
          this.nextSlide();
        } else if (type === 'prev') {
          this.prevSlide();
        }
      };

      const onClick = e => {
        const target = e.target;
        const arrow = target.closest(`.${classes.arrow}`);

        if (arrow) {
          onArrowClick(arrow);
        }
      };

      this.el.addEventListener('click', onClick);
    }

    _resetStylesAfterAnimation(item) {
      item.style.opacity = '';
      item.classList.remove(classes.animOut);
    }

    _refreshTimer() {
      clearInterval(this.timer);
      this._runAutoPlay();
    }

    _runAutoPlay() {
      this.timer = setInterval(() => this.nextSlide(), this.options.autoPlayTime);
    }

    _createWrapper() {
      const wrapper = document.createElement('div');

      wrapper.classList.add(classes.wrapper);

      for (let i = 0; i < this.items.length; i++) {
        const item = this.items[i];
        wrapper.appendChild(item);
      }

      this.wrapper = wrapper;
      this.el.appendChild(wrapper);
    }

    _createArrows() {
      const makeArrow = (type, text) => {
        const arrow = document.createElement('button');

        arrow.className = `${classes.arrow} ${this.options.arrowClass}`;
        arrow.setAttribute('data-type', type);
        arrow.textContent = text;

        return arrow;
      };

      const contSelector = this.options.arrowsContainer;
      const containers = contSelector ? this.el.querySelectorAll(contSelector) : this.el;

      for (let i = 0; i < containers.length; i++) {
        const container = containers[i];
        const prevArrow = makeArrow('prev', '<<');
        const nextArrow = makeArrow('next', '>>');

        container.insertAdjacentElement('afterbegin', prevArrow);
        container.insertAdjacentElement('beforeend', nextArrow);
      }
    }
  }

  APP.namespace('modules.components').Slider = Slider;
})();
