(function() {
  /**
 * Функция для создания анимации
 * @param {Object} options - Объект с настройками
 * @param {number} [options.duration=500] - Длительность анимации
 * @param {function} options.draw Функция, - описывающая анимацию
 * @param {function} option.onAnimationEnd функция, - вызываемая после завершения анимации
 * @return {Object} объект с методом cancel, для отмены анимации
 */
  const animate = options => {
    options = Object.assign(
      {
        duration: 500
      },
      options
    );

    let id = null;
    let start = performance.now();

    id = requestAnimationFrame(function frame(time) {
      // timeFraction от 0 до 1
      let progress = (time - start) / options.duration;

      if (progress > 1) {
        progress = 1;
      }

      options.draw(progress);

      if (progress < 1) {
        id = requestAnimationFrame(frame);
      } else if (typeof options.onAnimationEnd === 'function') {
        options.onAnimationEnd();
      }
    });

    return {
      cancel() {
        cancelAnimationFrame(id);
      }
    };
  };

  APP.namespace('modules.helpers').animate = animate;
})();
