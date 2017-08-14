const APP = APP || {};

APP.namespace = function(moduleName) {
  let parts = moduleName.split('.');
  let parent = APP;
  let i;

  // отбросить начальный префикс – имя глобального объекта
  if (parts[0] === 'APP') {
    parts = parts.slice(1);
  }

  for (i = 0; i < parts.length; i += 1) {
    // создать свойство, если оно отсутствует
    if (typeof parent[parts[i]] === 'undefined') {
      parent[parts[i]] = {};
    }
    parent = parent[parts[i]];
  }

  return parent;
};
